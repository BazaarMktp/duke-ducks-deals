import { useState } from 'react';
import { toast } from 'sonner';
import { convertUsersToCSV, downloadCSV } from '@/utils/csvExport';

interface CsvUser {
  id: string;
  email: string;
  profile_name: string;
  full_name: string;
  created_at: string;
  is_banned?: boolean;
  ban_reason?: string;
  banned_at?: string;
  college_id?: string;
}

interface College {
  id: string;
  name: string;
}

export const useUserCSVExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportUsersToCSV = async (users: CsvUser[], colleges: College[]) => {
    try {
      setIsExporting(true);
      
      if (users.length === 0) {
        toast.error('No users to export');
        return;
      }

      const csvContent = convertUsersToCSV(users, colleges);
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `bazaar_users_export_${currentDate}.csv`;
      
      downloadCSV(csvContent, filename);
      toast.success(`Exported ${users.length} users to CSV`);
    } catch (error) {
      console.error('Error exporting users to CSV:', error);
      toast.error('Failed to export users to CSV');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportUsersToCSV,
    isExporting
  };
};