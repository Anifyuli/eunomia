# 🛠️ User API Specifications

This documentation outlines the available endpoints for managing users in the system.

---

## 📝 Register User

### **📍 Endpoint**

**POST** `/api/users`

### **📤 Request Body**

```json
{
  "username": "Anifyuli",
  "password": "password123",
  "name": "Anif"
}
```

### **✅ Response (Success)**

```json
{
  "data": {
    "username": "Anifyuli",
    "name": "Anif"
  }
}
```

### **❌ Response (Failed)**

```json
{
  "errors": "Your username or password is incorrect"
}
```

---

## 🔍 Get User

### **📍 Endpoint**

**GET** `/api/users/current`

### **📥 Headers**

| Key           | Value              | Required |
| ------------- | ------------------ | -------- |
| Authorization | `token` (optional) | ❌ No\*  |

> \*JWT authentication will be implemented later for security.

### **✅ Response (Success)**

```json
{
  "data": {
    "username": "Anifyuli",
    "name": "Anif"
  }
}
```

### **❌ Response (Failed)**

```json
{
  "errors": "Your request is unauthorized"
}
```

---

## ✏️ Update User

### **📍 Endpoint**

**PATCH** `/api/users/current`

### **📥 Headers**

| Key           | Value              | Required |
| ------------- | ------------------ | -------- |
| Authorization | `token` (optional) | ❌ No\*  |

### **📤 Request Body**

```json
{
  "password": "p455w07d123", // Change password (optional)
  "name": "Anifyuli" // Change display name (optional)
}
```

### **✅ Response (Success)**

```json
{
  "data": {
    "username": "Anifyuli",
    "name": "Anif"
  }
}
```

### **❌ Response (Failed)**

```json
{
  "errors": "Your request is unauthorized"
}
```

---

## 🚪 Logout User

### **📍 Endpoint**

**POST** `/api/users/logout`

### **📥 Headers**

| Key           | Value              | Required |
| ------------- | ------------------ | -------- |
| Authorization | `token` (optional) | ❌ No\*  |

### **✅ Response (Success)**

```json
{
  "data": true,
  "message": "Logout successful"
}
```

---

## 📌 Notes:

- JWT authentication is **not yet implemented** but will be added later.
- All error responses follow this format:
  ```json
  {
    "errors": "Error message"
  }
  ```
- The **Logout** endpoint has been updated to `/api/users/logout` for better clarity.

---
