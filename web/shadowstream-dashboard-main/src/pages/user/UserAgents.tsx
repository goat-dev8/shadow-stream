import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Plus, Bot, Copy, Check, Key } from 'lucide-react';
import { mockAgents, mockVaults } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export function UserAgents() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Agents</h1>
          <p className="text-muted-foreground">
            Agents are software credentials that can spend from your vaults within your rules.
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} variant="hero">
          <Plus className="w-4 h-4" />
          Create Agent Credential
        </Button>
      </div>

      {/* Agents Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Agent</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">API Key</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Linked Vaults</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockAgents.map((agent, index) => (
                <motion.tr
                  key={agent.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-sm text-muted-foreground">{agent.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                        {agent.apiKey}
                      </code>
                      <button 
                        onClick={() => handleCopy(agent.apiKey, agent.id)}
                        className="p-1.5 rounded hover:bg-muted transition-colors"
                      >
                        {copiedId === agent.id ? (
                          <Check className="w-4 h-4 text-accent" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-muted-foreground">{agent.linkedVaults.length} vaults</span>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium",
                      agent.status === 'active' 
                        ? "bg-accent/20 text-accent" 
                        : "bg-destructive/20 text-destructive"
                    )}>
                      {agent.status === 'active' ? 'Active' : 'Revoked'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Create Modal */}
      <AgentCreateModal open={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
}

function AgentCreateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    vaults: [] as string[],
  });
  const [created, setCreated] = useState(false);
  const [generatedKey, setGeneratedKey] = useState('');

  const handleCreate = () => {
    setGeneratedKey('ss_agent_' + Math.random().toString(36).substring(2, 15));
    setCreated(true);
  };

  const handleClose = () => {
    setCreated(false);
    setFormData({ name: '', description: '', vaults: [] });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>{created ? 'Agent Created!' : 'Create Agent Credential'}</DialogTitle>
        </DialogHeader>

        {!created ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="agentName">Agent Name</Label>
              <Input
                id="agentName"
                placeholder="e.g., ResearchBot Alpha"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="agentDesc">Description</Label>
              <Textarea
                id="agentDesc"
                placeholder="What will this agent do?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1.5 resize-none"
                rows={2}
              />
            </div>
            <div>
              <Label>Link to Policy Vaults</Label>
              <div className="space-y-2 mt-2">
                {mockVaults.map((vault) => (
                  <label
                    key={vault.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                      formData.vaults.includes(vault.id)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={formData.vaults.includes(vault.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, vaults: [...formData.vaults, vault.id] });
                        } else {
                          setFormData({ ...formData, vaults: formData.vaults.filter(v => v !== vault.id) });
                        }
                      }}
                      className="sr-only"
                    />
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                      <Key className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{vault.name}</p>
                      <p className="text-xs text-muted-foreground">{vault.token}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={handleClose}>Cancel</Button>
              <Button variant="hero" onClick={handleCreate}>Create Agent</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/30">
              <p className="text-sm text-accent mb-2">Your agent credential (save it now!):</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm bg-muted px-3 py-2 rounded font-mono break-all">
                  {generatedKey}
                </code>
                <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(generatedKey)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              This key will only be shown once. Store it securely.
            </p>
            <Button onClick={handleClose} className="w-full">Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
