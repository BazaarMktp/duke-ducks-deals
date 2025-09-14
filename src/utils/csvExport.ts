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

export const convertUsersToCSV = (users: CsvUser[], colleges: College[]): string => {
  const getCollegeName = (collegeId: string) => {
    return colleges.find(c => c.id === collegeId)?.name || 'N/A';
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString();
  };

  const escapeCSVField = (field: string | undefined): string => {
    if (!field) return '';
    // Escape quotes by doubling them and wrap in quotes if contains comma, quote, or newline
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  };

  // CSV headers
  const headers = [
    'Email',
    'Profile Name', 
    'Full Name',
    'College',
    'Status',
    'Created Date',
    'Ban Reason',
    'Banned Date'
  ];

  // Convert users to CSV rows
  const rows = users.map(user => [
    escapeCSVField(user.email),
    escapeCSVField(user.profile_name),
    escapeCSVField(user.full_name),
    escapeCSVField(getCollegeName(user.college_id || '')),
    user.is_banned ? 'Banned' : 'Active',
    formatDate(user.created_at),
    escapeCSVField(user.ban_reason || ''),
    formatDate(user.banned_at)
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');

  return csvContent;
};

export const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};