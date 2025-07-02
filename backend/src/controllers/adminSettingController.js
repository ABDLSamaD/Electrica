// POST /api/admin/change-password
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Verify admin token
    const token = req.cookies.adminToken;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded.adminId;

    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "New password must be at least 8 characters long" });
    }

    // Get current admin from database
    const admin = await getAdminById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      admin.password
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password in database
    await updateAdminPassword(adminId, hashedNewPassword);

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getAdminById(adminId) {
  // Your database query logic here
  // Example: return await Admin.findById(adminId)
  const admin = await findAdminById(adminId);
  if (!admin) {
    return null;
  }
  return { id: adminId, password: "hashedPassword" }; // Placeholder
}

async function updateAdminPassword(adminId, hashedPassword) {
  // Your database update logic here
  // Example: await Admin.findByIdAndUpdate(adminId, { password: hashedPassword })
}


// system-settings controller
export default async function handler(req, res) {
    if (req.method !== "PUT") {
      return res.status(405).json({ message: "Method not allowed" })
    }
  
    try {
      // Verify admin token
      const token = req.cookies.adminToken
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const adminId = decoded.adminId
  
      // Verify admin has system permissions
      const admin = await getAdminById(adminId)
      if (!admin || admin.role !== "super_admin") {
        return res.status(403).json({ message: "Insufficient permissions" })
      }
  
      const { maintenanceMode, debugMode, logLevel } = req.body
  
      // Validate log level
      const validLogLevels = ["error", "warn", "info", "debug"]
      if (logLevel && !validLogLevels.includes(logLevel)) {
        return res.status(400).json({ message: "Invalid log level" })
      }
  
      // Update system settings
      const updatedSettings = await updateSystemSettings({
        maintenanceMode,
        debugMode,
        logLevel,
      })
  
      // If maintenance mode is enabled, you might want to:
      // - Send notifications to users
      // - Update system status
      // - Log the change
  
      res.status(200).json({
        message: "System settings updated successfully",
        settings: updatedSettings,
      })
    } catch (error) {
      console.error("Update system settings error:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }
  
  async function updateSystemSettings(settings) {
    // Your database/config update logic here
    // This might involve updating a system_settings table or config file
    return settings
  }


//   update account settings controller
export default async function handler(req, res) {
    if (req.method !== "PUT") {
      return res.status(405).json({ message: "Method not allowed" })
    }
  
    try {
      // Verify admin token
      const token = req.cookies.adminToken
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const adminId = decoded.adminId
  
      const { username, email } = req.body
  
      // Validate input
      if (!username || !email) {
        return res.status(400).json({ message: "Username and email are required" })
      }
  
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" })
      }
  
      // Update admin account in database
      // Replace with your database logic
      const updatedAdmin = await updateAdminAccount(adminId, { username, email })
  
      res.status(200).json({
        message: "Account updated successfully",
        admin: {
          id: updatedAdmin.id,
          username: updatedAdmin.username,
          email: updatedAdmin.email,
        },
      })
    } catch (error) {
      console.error("Update account error:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }
  
  // Database function (implement based on your database)
  async function updateAdminAccount(adminId: string, data: { username: string; email: string }) {
    // Your database update logic here
    // Example with MongoDB/Mongoose:
    // return await Admin.findByIdAndUpdate(adminId, data, { new: true })
  
    // Example with SQL:
    // return await db.query('UPDATE admins SET username = ?, email = ? WHERE id = ?', [data.username, data.email, adminId])
  
    // Placeholder return
    return { id: adminId, ...data }
  }


//   prefrenses controller admin
export default async function handler(req, res) {
    if (req.method !== "PUT") {
      return res.status(405).json({ message: "Method not allowed" })
    }
  
    try {
      // Verify admin token
      const token = req.cookies.adminToken
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const adminId = decoded.adminId
  
      const { darkMode, notifications, emailNotifications, autoUpdate, autoBackup } = req.body
  
      // Update preferences in database
      const updatedPreferences = await updateAdminPreferences(adminId, {
        darkMode,
        notifications,
        emailNotifications,
        autoUpdate,
        autoBackup,
      })
  
      res.status(200).json({
        message: "Preferences updated successfully",
        preferences: updatedPreferences,
      })
    } catch (error) {
      console.error("Update preferences error:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }
async function updateAdminPreferences(adminId, preferences) {
    // Your database update logic here
    // Example: Update admin_preferences table or admin document
    return preferences
  }
  
  