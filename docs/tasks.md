# ✅ Task API Specifications

This documentation outlines the available endpoints for managing tasks in the system.

---

## 📝 Create Task

### **📍 Endpoint**

**POST** `/api/tasks`

### **📤 Request Body**

```json
{
  "title": "Learn Python",
  "description": "Study Python fundamentals",
  "due_date": "2025-12-31"
}
```

### **✅ Response (Success)**

```json
{
  "data": {
    "id": 1,
    "title": "Learn Python",
    "description": "Study Python fundamentals",
    "due_date": "2025-12-31",
    "status": "pending"
  }
}
```

### **❌ Response (Failed)**

```json
{
  "errors": "Task creation failed"
}
```

---

## 🔍 Get All Tasks

### **📍 Endpoint**

**GET** `/api/tasks`

### **✅ Response (Success)**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Learn Python",
      "description": "Study Python fundamentals",
      "due_date": "2025-12-31",
      "status": "pending"
    },
    {
      "id": 2,
      "title": "Learn JavaScript",
      "description": "Study JavaScript basics",
      "due_date": "2025-11-30",
      "status": "completed"
    }
  ]
}
```

---

## 🔍 Get Task by ID

### **📍 Endpoint**

**GET** `/api/tasks/{id}`

### **✅ Response (Success)**

```json
{
  "data": {
    "id": 1,
    "title": "Learn Python",
    "description": "Study Python fundamentals",
    "due_date": "2025-12-31",
    "status": "pending"
  }
}
```

### **❌ Response (Failed)**

```json
{
  "errors": "Task not found"
}
```

---

## ✏️ Update Task

### **📍 Endpoint**

**PATCH** `/api/tasks/{id}`

### **📤 Request Body**

```json
{
  "title": "Learn Advanced Python",
  "description": "Study advanced Python concepts",
  "due_date": "2025-12-31",
  "status": "in_progress"
}
```

### **✅ Response (Success)**

```json
{
  "data": {
    "id": 1,
    "title": "Learn Advanced Python",
    "description": "Study advanced Python concepts",
    "due_date": "2025-12-31",
    "status": "in_progress"
  }
}
```

### **❌ Response (Failed)**

```json
{
  "errors": "Task update failed"
}
```

---

## 🗑️ Delete Task

### **📍 Endpoint**

**DELETE** `/api/tasks/{id}`

### **✅ Response (Success)**

```json
{
  "message": "Task with ID 1 has been deleted"
}
```

### **❌ Response (Failed)**

```json
{
  "errors": "Task deletion failed"
}
```

---

## ✅ Complete Task

### **📍 Endpoint**

**PATCH** `/api/tasks/{id}/complete`

### **✅ Response (Success)**

```json
{
  "data": {
    "id": 1,
    "title": "Learn Python",
    "description": "Study Python fundamentals",
    "due_date": "2025-12-31",
    "status": "completed"
  }
}
```

### **❌ Response (Failed)**

```json
{
  "errors": "Task completion failed"
}
```

---

## 📌 Notes

- All error responses follow this format:

  ```json
  {
    "errors": "Error message"
  }
  ```

- Tasks have statuses:
  - **pending** → default status when created
  - **in_progress** → task is actively being worked on
  - **completed** → task is finished

---
