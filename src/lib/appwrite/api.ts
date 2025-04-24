import { ID, Query, ImageGravity } from 'appwrite';

import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, appwriteConfig, avatars, client, databases, storage } from './config';


export async function createUserAccount(user:INewUser) {
    try {
        const newAccount = await account.create(
           ID.unique(),
           user.email,
           user.password,
           user.name
        );

    if(!newAccount) throw Error;
    
    const avatarUrl = avatars.getInitials(user.name);

     const newUser = await saveUserToDB({
        accountId: newAccount.$id,
        name: newAccount.name,
        email: newAccount.email,
        username: user.username,
        imageUrl: new URL(avatarUrl),

     });
        

        return newUser;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function saveUserToDB(user: {
   accountId: string;
   email: string;
   name: string;
   imageUrl: URL;
   username? : string;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        );
        return newUser;
    } catch (error) {
        console.log(error);
    }

}

export async function signInAccount(user: { email: string; password: string }) {
  try {
      // Oturum oluştur
      const session = await account.createEmailPasswordSession(user.email, user.password);
      
      // ÖNEMLİ: Oluşturulan oturumu client'a bildir
      // Bu satır eksikti ve muhtemelen hatanın ana sebebi
      client.setSession(session.secret);
      
      return session;
  } catch (error) {
      console.log(error);
      throw error; // Hata fırlatarak çağıran kodun hatayı ele almasını sağlayın
  }
}

export async function getAccount() {
  try {
      const currentAccount = await account.get();
      return currentAccount;
  } catch (error) {
      console.log(error);
      return null; // Hata durumunda null döndür (kullanıcı giriş yapmamış olabilir)
  }
}

export async function getCurrentUser() {
  try {
      const currentAccount = await account.get();
      
      if (!currentAccount) throw Error("Kullanıcı hesabı bulunamadı");
      
      const currentUser = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          [Query.equal('accountId', currentAccount.$id)]
      );
      
      if(!currentUser) throw Error("Kullanıcı bilgileri bulunamadı");
      
      return currentUser.documents[0];
  } catch (error) {
      console.log(error);
      return null;
  }
}

// ============================== SIGN OUT
export async function signOutAccount() {
    try {
      const session = await account.deleteSession("current");
  
      return session;
    } catch (error) {
      console.log(error);
    }
  }

  // ============================== CREATE POST
export async function createPost(post: INewPost) {
    try {
      // Upload file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
  
      if (!uploadedFile) throw Error;
  
      // Get file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
  
      // Convert tags into array
      const tags = post.tags?.replace(/ /g, "").split(",") || [];
  
      // Create post
      const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        ID.unique(),
        {
          creator: post.userId,
          caption: post.caption,
          imageUrl: fileUrl,
          imageId: uploadedFile.$id,
          location: post.location,
          tags: tags,
        }
      );
  
      if (!newPost) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
  
      return newPost;
    } catch (error) {
      console.log(error);
    }
  }

  // ============================== UPLOAD FILE
export async function uploadFile(file: File) {
    try {
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file
      );
  
      return uploadedFile;
    } catch (error) {
      console.log(error);
    }
  }

  // ============================== GET FILE URL
export function getFilePreview(fileId: string) {
    try {
      const fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100
      );
  
      if (!fileUrl) throw Error;
  
      return fileUrl;
    } catch (error) {
      console.log(error);
    }
  }

  // ============================== DELETE FILE
export async function deleteFile(fileId: string) {
    try {
      await storage.deleteFile(appwriteConfig.storageId, fileId);
  
      return { status: "ok" };
    } catch (error) {
      console.log(error);
    }
  }

  
  export async function getRecentPosts() {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(20)]
      );
  
      if (!posts) throw Error;
  
      return posts;
    } catch (error) {
      console.log(error);
    }
  }

  // ============================== LIKE / UNLIKE POST
export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}


// ============================== SAVE POST
export async function savePost(userId: string, postId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== DELETE SAVED POST
export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POST BY ID
export async function getPostById(postId?: string) {
  if (!postId) throw Error;

  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPDATE POST
export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: new URL(fileUrl), imageId: uploadedFile.$id };
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    //  Update post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    // Failed to update
    if (!updatedPost) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }

      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (hasFileToUpdate) {
      await deleteFile(post.imageId);
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== DELETE POST
export async function deletePost(postId?: string, imageId?: string) {
  if (!postId || !imageId) return;

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!statusCode) throw Error;

    await deleteFile(imageId);

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER'S POST
export async function getUserPosts(userId?: string) {
  if (!userId) return;

  try {
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USERS
export async function getUsers(limit?: number) {
  const queries: any[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER BY ID
export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPDATE USER
export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POSTS
export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

// export async function followUser(followerId: string, followingId: string) {
//   try {
//     const follow = await databases.createDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.followsCollectionId,
//       ID.unique(),
//       {
//         follower: followerId,
//         following: followingId,
//       }
//     );

//     if (!follow) throw Error;

//     return follow;
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function unfollowUser(followerId: string, followingId: string) {
//   try {
//     const query = [
//       Query.equal('follower', followerId),
//       Query.equal('following', followingId),
//     ];
//     const response = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.followsCollectionId,
//       query
//     );

//     if (response.documents.length > 0) {
//       const documentId = response.documents[0].$id;
//       await databases.deleteDocument(
//         appwriteConfig.databaseId,
//         appwriteConfig.followsCollectionId,
//         documentId
//       );
//       return true;
//     } else {
//       return false; // Or throw an error indicating the user isn't following the other
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

// Takip etme fonksiyonu
// export const followUser = async (followerId: string, followedId: string) => {
//   try {
//     // Takip etme işlemini veritabanına kaydet
//     const followData = {
//       followerId: followerId,
//       followedId: followedId,
//       timestamp: new Date().toISOString(),
//     };

//     // Veritabanında takip ilişkisini ekle
//     const result = await databases.createDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.followCollectionId, // Takip koleksiyonu
//       'unique()', // Unique id
//       followData
//     );

//     return result;  // Takip ilişkisini başarıyla kaydet
//   } catch (error) {
//     console.error('Takip etme işlemi sirasinda hata oluştu: ', error);
//     throw error;  // Hata durumunda hata fırlat
//   }
// };

// // API fonksiyonu: Takipten Çıkma
// export const unfollowUser = async (followerId: string, followedId: string) => {
//   try {
//     // Takip ilişkisini veritabanından sil
//     const result = await databases.deleteDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.followCollectionId,
//       `unique(${followerId}_${followedId})`  // Takip ilişkisini eşsiz bir id ile sil
//     );

//     return result;  // Takipten çıkma işlemi başarıyla tamamlandı
//   } catch (error) {
//     console.error('Takipten çıkma işlemi sırasında hata oluştu: ', error);
//     throw error;  // Hata durumunda hata fırlat
//   }
// };

// // API fonksiyonu: Takipçileri ve Takip Edilenleri Getirme
// export const getFollowersAndFollowing = async (userId: string) => {
//   try {
//     // Takip edilenleri sorgula
//     const following = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.followCollectionId,
//       [
//         Query.equal('followerId', userId)
//       ]
//     );

//     // Takipçileri sorgula
//     const followers = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.followCollectionId,
//       [
//         Query.equal('followedId', userId)
//       ]
//     );

//     return { following: following.documents, followers: followers.documents };
//   } catch (error) {
//     console.error('Takipçi ve takip edilenler alınırken hata oluştu: ', error);
//     throw error;
//   }
// };
