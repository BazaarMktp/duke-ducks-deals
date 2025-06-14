
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface Report {
  id: string;
  created_at: string;
  reason: string;
  description: string;
  status: string;
  listing_id: string;
  reporter_id: string;
  listings: {
    title: string;
  } | null;
}

const ReportManagement = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('reports')
                .select(`
                    *,
                    listings ( title )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReports(data || []);
        } catch (error) {
            console.error('Error fetching reports:', error);
            toast.error('Failed to fetch reports.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);
    
    const updateReportStatus = async (reportId: string, status: string) => {
        try {
            await supabase.from('reports').update({ status }).eq('id', reportId).throwOnError();
            toast.success(`Report status updated to ${status}`);
            fetchReports(); // Refresh list
        } catch (error) {
            console.error('Error updating report status:', error);
            toast.error('Failed to update report status.');
        }
    };

    const deleteReport = async (reportId: string) => {
        try {
            await supabase.from('reports').delete().eq('id', reportId).throwOnError();
            toast.success('Report deleted.');
            fetchReports(); // Refresh list
        } catch (error) {
            console.error('Error deleting report:', error);
            toast.error('Failed to delete report.');
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading reports...</div>;
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <Badge variant="destructive">Pending</Badge>;
            case 'resolved': return <Badge variant="secondary" className="bg-green-100 text-green-800">Resolved</Badge>;
            case 'dismissed': return <Badge variant="outline">Dismissed</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Report Management</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Listing</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Reporter ID</TableHead>
                            <TableHead>Reported</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">No reports found.</TableCell>
                            </TableRow>
                        )}
                        {reports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell>
                                    <Link to={`/marketplace/${report.listing_id}`} className="hover:underline">
                                        {report.listings?.title || 'Listing not found'}
                                    </Link>
                                </TableCell>
                                <TableCell>{report.reason}</TableCell>
                                <TableCell className="font-mono text-xs">{report.reporter_id}</TableCell>
                                <TableCell>{formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}</TableCell>
                                <TableCell>{getStatusBadge(report.status)}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => updateReportStatus(report.id, 'resolved')}>Mark as Resolved</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => updateReportStatus(report.id, 'dismissed')}>Dismiss</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => deleteReport(report.id)} className="text-red-600">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default ReportManagement;
