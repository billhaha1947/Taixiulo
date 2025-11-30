const { runAsync, getAsync, allAsync } = require('../config/database');

class AdminSettings {
    // Get setting by key
    static async get(key) {
        const sql = `
            SELECT setting_value FROM admin_settings
            WHERE setting_key = ?
        `;
        
        const row = await getAsync(sql, [key]);
        return row ? row.setting_value : null;
    }

    // Set setting value
    static async set(key, value) {
        const sql = `
            INSERT INTO admin_settings (setting_key, setting_value, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(setting_key) 
            DO UPDATE SET setting_value = ?, updated_at = CURRENT_TIMESTAMP
        `;
        
        return await runAsync(sql, [key, value, value]);
    }

    // Get all settings
    static async getAll() {
        const sql = `
            SELECT setting_key, setting_value, updated_at
            FROM admin_settings
        `;
        
        const rows = await allAsync(sql);
        
        // Convert to object
        const settings = {};
        rows.forEach(row => {
            settings[row.setting_key] = row.setting_value;
        });
        
        return settings;
    }

    // Get winrate percentage
    static async getWinrate() {
        const value = await this.get('winrate_percentage');
        return value ? parseFloat(value) : 48;
    }

    // Set winrate percentage
    static async setWinrate(percentage) {
        if (percentage < 0 || percentage > 100) {
            throw new Error('Winrate must be between 0 and 100');
        }
        
        return await this.set('winrate_percentage', percentage.toString());
    }

    // Check if maintenance mode is enabled
    static async isMaintenanceMode() {
        const value = await this.get('maintenance_mode');
        return value === '1';
    }

    // Enable maintenance mode
    static async enableMaintenance() {
        return await this.set('maintenance_mode', '1');
    }

    // Disable maintenance mode
    static async disableMaintenance() {
        return await this.set('maintenance_mode', '0');
    }
}

module.exports = AdminSettings;
