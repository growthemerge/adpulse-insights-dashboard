
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, MailPlus, UserPlus, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'pending';
  dateAdded: string;
}

const Team = () => {
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      email: 'john@example.com',
      role: 'admin',
      status: 'active',
      dateAdded: '2023-12-01',
    },
    {
      id: '2',
      email: 'sarah@example.com',
      role: 'user',
      status: 'active',
      dateAdded: '2023-12-05',
    },
    {
      id: '3',
      email: 'mike@example.com',
      role: 'user',
      status: 'pending',
      dateAdded: '2023-12-10',
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMemberEmail) {
      toast.error('Please enter an email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add new member to the list
      const newMember: TeamMember = {
        id: Math.random().toString(36).substring(2, 9),
        email: newMemberEmail,
        role: 'user',
        status: 'pending',
        dateAdded: new Date().toISOString().split('T')[0],
      };
      
      setTeamMembers([...teamMembers, newMember]);
      setNewMemberEmail('');
      setIsDialogOpen(false);
      
      toast.success('Team member invitation sent successfully!');
    } catch (error) {
      toast.error('Failed to send invitation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
    toast.success('Team member removed successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Team Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage team members and their access to your AdPulse account
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-green text-brand-darkBlue hover:bg-brand-green/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card">
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to a new team member to join your AdPulse account.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleAddMember}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    required
                    className="bg-secondary/50"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-brand-green text-brand-darkBlue hover:bg-brand-green/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <MailPlus className="mr-2 h-4 w-4" />
                      Send Invitation
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="glass-card">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Team Members</h2>
          
          <div className="border border-border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.email}</TableCell>
                    <TableCell className="capitalize">{member.role}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.status === 'active'
                          ? 'bg-brand-green/20 text-brand-green'
                          : 'bg-brand-gold/20 text-brand-gold'
                      }`}>
                        {member.status}
                      </span>
                    </TableCell>
                    <TableCell>{member.dateAdded}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-brand-red"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {teamMembers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No team members yet</p>
            </div>
          )}
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              Team members will receive an email invitation with instructions to join your AdPulse account.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Team;
