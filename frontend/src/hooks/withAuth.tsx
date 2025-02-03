import { getItemLocalStorage } from "@/lib/storage";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const publicRoutes = ["/login", "/register"];

const useAuth = () => {
  const router = useRouter();
  const currentPath = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = getItemLocalStorage("token");

      if (!token) {
        if (!publicRoutes.includes(currentPath)) {
          router.push("/login");
        }
      } else {
        if (publicRoutes.includes(currentPath)) {
          router.push("/");
        }
      }
    }
  }, [currentPath]);
};

export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthComponent = (props: P) => {
    useAuth();
    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return AuthComponent;
};

export default withAuth;
