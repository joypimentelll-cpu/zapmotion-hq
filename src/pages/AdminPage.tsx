import React, { useState, useMemo } from 'react';
import { Download, Search, Eye, Edit2, Trash2, Users, CalendarDays, Clock, Filter, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/i18n';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Registration {
  id: string;
  fullName: string;
  email: string;
  employeeId: string;
  department: string;
  familiarityLevel: string;
  needsAccessibility: boolean;
  accessibilityDetails?: string;
  observations?: string;
  participationDate: Date;
  createdAt: Date;
  status: 'pending' | 'confirmed' | 'completed';
}

interface AuditLog {
  id: string;
  action: 'view' | 'edit' | 'delete' | 'export';
  userId: string;
  targetId: string;
  targetName: string;
  timestamp: Date;
  details?: string;
}

// Mock data
const mockRegistrations: Registration[] = [
  {
    id: '1',
    fullName: 'Ana Silva',
    email: 'ana.silva@empresa.com',
    employeeId: 'EMP001',
    department: 'ti',
    familiarityLevel: 'high',
    needsAccessibility: false,
    participationDate: new Date(2024, 11, 15),
    createdAt: new Date(2024, 10, 1),
    status: 'confirmed',
  },
  {
    id: '2',
    fullName: 'Carlos Santos',
    email: 'carlos.santos@empresa.com',
    employeeId: 'EMP002',
    department: 'marketing',
    familiarityLevel: 'low',
    needsAccessibility: true,
    accessibilityDetails: 'Necessita de legendas para vídeos',
    participationDate: new Date(2024, 11, 20),
    createdAt: new Date(2024, 10, 5),
    status: 'pending',
  },
  {
    id: '3',
    fullName: 'Mariana Costa',
    email: 'mariana.costa@empresa.com',
    employeeId: 'EMP003',
    department: 'rh',
    familiarityLevel: 'medium',
    needsAccessibility: false,
    participationDate: new Date(2025, 0, 10),
    createdAt: new Date(2024, 10, 10),
    status: 'confirmed',
  },
  {
    id: '4',
    fullName: 'Pedro Oliveira',
    email: 'pedro.oliveira@empresa.com',
    employeeId: 'EMP004',
    department: 'financeiro',
    familiarityLevel: 'high',
    needsAccessibility: false,
    participationDate: new Date(2025, 0, 15),
    createdAt: new Date(2024, 10, 12),
    status: 'completed',
  },
  {
    id: '5',
    fullName: 'Julia Lima',
    email: 'julia.lima@empresa.com',
    employeeId: 'EMP005',
    department: 'comercial',
    familiarityLevel: 'low',
    needsAccessibility: true,
    accessibilityDetails: 'Alto contraste necessário',
    participationDate: new Date(2025, 0, 22),
    createdAt: new Date(2024, 10, 15),
    status: 'pending',
  },
];

const mockLogs: AuditLog[] = [
  { id: '1', action: 'view', userId: 'admin', targetId: '1', targetName: 'Ana Silva', timestamp: new Date(), details: 'Visualizou perfil' },
  { id: '2', action: 'export', userId: 'admin', targetId: 'all', targetName: 'Todos', timestamp: new Date(Date.now() - 3600000), details: 'Exportou CSV' },
  { id: '3', action: 'edit', userId: 'admin', targetId: '2', targetName: 'Carlos Santos', timestamp: new Date(Date.now() - 7200000), details: 'Alterou departamento' },
];

export default function AdminPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [registrations, setRegistrations] = useState<Registration[]>(mockRegistrations);
  const [logs] = useState<AuditLog[]>(mockLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [familiarityFilter, setFamiliarityFilter] = useState('all');
  const [accessibilityFilter, setAccessibilityFilter] = useState('all');
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [registrationToDelete, setRegistrationToDelete] = useState<Registration | null>(null);

  const departments = [
    { value: 'ti', label: 'TI' },
    { value: 'rh', label: 'RH' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'comercial', label: 'Comercial' },
    { value: 'financeiro', label: 'Financeiro' },
    { value: 'outro', label: 'Outro' },
  ];

  const familiarityLevels = [
    { value: 'low', label: 'Baixo' },
    { value: 'medium', label: 'Médio' },
    { value: 'high', label: 'Alto' },
  ];

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const matchesSearch = 
        reg.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDepartment = departmentFilter === 'all' || reg.department === departmentFilter;
      const matchesFamiliarity = familiarityFilter === 'all' || reg.familiarityLevel === familiarityFilter;
      const matchesAccessibility = 
        accessibilityFilter === 'all' || 
        (accessibilityFilter === 'yes' && reg.needsAccessibility) ||
        (accessibilityFilter === 'no' && !reg.needsAccessibility);

      return matchesSearch && matchesDepartment && matchesFamiliarity && matchesAccessibility;
    });
  }, [registrations, searchQuery, departmentFilter, familiarityFilter, accessibilityFilter]);

  const stats = useMemo(() => ({
    total: registrations.length,
    today: registrations.filter(r => 
      format(r.createdAt, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    ).length,
    pending: registrations.filter(r => r.status === 'pending').length,
    completed: registrations.filter(r => r.status === 'completed').length,
  }), [registrations]);

  const handleView = (registration: Registration) => {
    setSelectedRegistration(registration);
    setIsViewDialogOpen(true);
  };

  const handleDeleteClick = (registration: Registration) => {
    setRegistrationToDelete(registration);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (registrationToDelete) {
      setRegistrations(prev => prev.filter(r => r.id !== registrationToDelete.id));
      toast({
        title: t('common.success'),
        description: `Registro de ${registrationToDelete.fullName} excluído.`,
      });
      setIsDeleteDialogOpen(false);
      setRegistrationToDelete(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Nome', 'Email', 'Matrícula', 'Departamento', 'Familiaridade', 'Acessibilidade', 'Data Participação', 'Status'];
    const rows = filteredRegistrations.map(reg => [
      reg.fullName,
      reg.email,
      reg.employeeId,
      departments.find(d => d.value === reg.department)?.label || reg.department,
      familiarityLevels.find(l => l.value === reg.familiarityLevel)?.label || reg.familiarityLevel,
      reg.needsAccessibility ? 'Sim' : 'Não',
      format(reg.participationDate, 'dd/MM/yyyy'),
      reg.status,
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inscricoes_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();

    toast({
      title: t('common.success'),
      description: 'CSV exportado com sucesso!',
    });
  };

  const getStatusBadge = (status: Registration['status']) => {
    const variants = {
      pending: 'bg-warning/10 text-warning border-warning/20',
      confirmed: 'bg-primary/10 text-primary border-primary/20',
      completed: 'bg-success/10 text-success border-success/20',
    };
    const labels = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      completed: 'Concluído',
    };
    return (
      <Badge variant="outline" className={cn('border', variants[status])}>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {t('admin.title')}
          </h1>
          <p className="text-muted-foreground">{t('admin.subtitle')}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, value: stats.total, label: t('admin.stats.total'), color: 'text-primary' },
            { icon: CalendarDays, value: stats.today, label: t('admin.stats.today'), color: 'text-secondary' },
            { icon: Clock, value: stats.pending, label: t('admin.stats.pending'), color: 'text-warning' },
            { icon: FileText, value: stats.completed, label: t('admin.stats.completed'), color: 'text-success' },
          ].map((stat, index) => (
            <div 
              key={index}
              className="glass rounded-xl p-4 md:p-6 shadow-card animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-lg bg-muted', stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="glass rounded-xl p-4 mb-6 shadow-card animate-fade-up" style={{ animationDelay: '200ms' }}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('common.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t('admin.filters.department')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.filters.all')}</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>{dept.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={familiarityFilter} onValueChange={setFamiliarityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder={t('admin.filters.familiarity')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.filters.all')}</SelectItem>
                  {familiarityLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={accessibilityFilter} onValueChange={setAccessibilityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder={t('admin.filters.accessibility')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.filters.all')}</SelectItem>
                  <SelectItem value="yes">{t('common.yes')}</SelectItem>
                  <SelectItem value="no">{t('common.no')}</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="secondary" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                {t('admin.exportCSV')}
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="glass rounded-xl overflow-hidden shadow-card animate-fade-up" style={{ animationDelay: '300ms' }}>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>{t('admin.table.name')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('admin.table.email')}</TableHead>
                <TableHead>{t('admin.table.department')}</TableHead>
                <TableHead className="hidden lg:table-cell">{t('admin.table.date')}</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">{t('admin.table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistrations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhum registro encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredRegistrations.map((registration) => (
                  <TableRow key={registration.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{registration.fullName}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {registration.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {departments.find(d => d.value === registration.department)?.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {format(registration.participationDate, 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>{getStatusBadge(registration.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(registration)}
                          aria-label={t('common.view')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={t('common.edit')}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(registration)}
                          aria-label={t('common.delete')}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Audit Logs Section */}
        <div className="mt-8 glass rounded-xl p-6 shadow-card animate-fade-up" style={{ animationDelay: '400ms' }}>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {t('admin.logs.title')}
          </h2>
          <div className="space-y-3">
            {logs.map((log) => (
              <div 
                key={log.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline">
                    {log.action === 'view' && 'Visualizar'}
                    {log.action === 'edit' && 'Editar'}
                    {log.action === 'delete' && 'Excluir'}
                    {log.action === 'export' && 'Exportar'}
                  </Badge>
                  <span className="text-sm">
                    <span className="font-medium">{log.userId}</span>
                    <span className="text-muted-foreground"> - {log.targetName}</span>
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {format(log.timestamp, 'HH:mm - dd/MM')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalhes da Inscrição</DialogTitle>
            </DialogHeader>
            {selectedRegistration && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium">{selectedRegistration.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Matrícula</p>
                    <p className="font-medium">{selectedRegistration.employeeId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedRegistration.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Departamento</p>
                    <p className="font-medium">
                      {departments.find(d => d.value === selectedRegistration.department)?.label}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Familiaridade</p>
                    <p className="font-medium">
                      {familiarityLevels.find(l => l.value === selectedRegistration.familiarityLevel)?.label}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Participação</p>
                    <p className="font-medium">{format(selectedRegistration.participationDate, 'dd/MM/yyyy')}</p>
                  </div>
                </div>
                {selectedRegistration.needsAccessibility && (
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Necessidades de Acessibilidade</p>
                    <p className="font-medium">{selectedRegistration.accessibilityDetails || 'Não especificado'}</p>
                  </div>
                )}
                {selectedRegistration.observations && (
                  <div>
                    <p className="text-sm text-muted-foreground">Observações</p>
                    <p>{selectedRegistration.observations}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                {t('common.close')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('common.delete')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('admin.confirmDelete')}
                {registrationToDelete && (
                  <span className="block mt-2 font-medium text-foreground">
                    {registrationToDelete.fullName}
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t('common.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
