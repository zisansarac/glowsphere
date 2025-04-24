import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AuthProvider from "./context/AuthContext";
import { QueryProvider } from "./lib/react-query/QueryProvider";
import { ThemeProvider } from './context/ThemeContext'; // ThemeProvider'ı burada da dahil et
import './globals.css'; // globals.css'yi buraya dahil et


ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
     <QueryProvider>
       <AuthProvider>
         <ThemeProvider> {/* ThemeProvider'ı buraya ekliyoruz */}
          <App />
         </ThemeProvider>
       </AuthProvider>
     </QueryProvider>
    </BrowserRouter>
)
