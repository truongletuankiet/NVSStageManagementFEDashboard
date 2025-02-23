import React, { useState } from "react";

const AuthProvider = ({ children }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignIn = () => {
    const hardcodedId = "truongletuankiet";
    const hardcodedPassword = "nhacVienTpHCM1@";

    // Nhập thông tin đăng nhập
    const enteredId = prompt("Enter ID:");
    const enteredPassword = prompt("Enter Password:");

    // Kiểm tra xem có đúng thông tin không
    if (enteredId === hardcodedId && enteredPassword === hardcodedPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Invalid ID or Password!");
    }
  };

  if (isAuthenticated) {
    return <div>{children}</div>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome! Click below to sign in:</h1>
      <button
        onClick={handleSignIn}
        style={{
          padding: "10px 20px",
          fontSize: "18px",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Sign In
      </button>
    </div>
  );
};

export default AuthProvider;
