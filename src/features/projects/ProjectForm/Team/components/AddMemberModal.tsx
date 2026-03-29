import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import FilterAndSearchOption from './FilterAndSearchOption';
import MemberList from './MemberList';
import { getErrorMessage } from '@/utils/errorHandler';
import { getAllPositionsAPI } from '@/services/position.service';
import { getAllBranchesAPI } from '@/services/branch.service';
import { IPositionResponse } from '@/types/position.type';
import { IBranchResponse } from '@/types/branch.type';
import { IUserResponse } from '@/types/user.type';
import { toast } from 'sonner';

type AddMemberModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect?: (user: IUserResponse) => void;
  onUnselect?: (user: IUserResponse) => void;
  selectedUsers?: IUserResponse[];
};

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  open,
  onOpenChange,
  onSelect,
  onUnselect,
  selectedUsers = [],
}) => {
  const [positions, setPositions] = useState<IPositionResponse[]>([]);
  const [branches, setBranches] = useState<IBranchResponse[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!open) {
      return () => {
        mounted = false;
      };
    }

    const fetchInitialData = async () => {
      try {
        setError(null);
        setIsLoading(true);

        const [positionsRes, branchesRes] = await Promise.all([
          getAllPositionsAPI(),
          getAllBranchesAPI(),
        ]);

        if (!mounted) return;

        setPositions(positionsRes ?? []);
        setBranches(branchesRes ?? []);
      } catch (e) {
        if (!mounted) return;
        const errorMessage = getErrorMessage(e, 'Could not load required data');
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchInitialData();

    return () => {
      mounted = false;
    };
  }, [open]);

  const [emailQuery, setEmailQuery] = useState('');
  const [branchQuery, setBranchQuery] = useState('');
  const [type, setType] = useState<number | null>(null);

  const handleOpenChange = (o: boolean) => {
    if (!o) {
      setEmailQuery('');
      setBranchQuery('');
      setType(null);
    }
    onOpenChange(o);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl h-[70vh] overflow-hidden flex flex-col px-4">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full pb-10">
          <div className="sticky top-0 z-10 bg-background pb-2">
            <FilterAndSearchOption
              emailQuery={emailQuery}
              onEmailQueryChange={setEmailQuery}
              branchQuery={branchQuery}
              onBranchQueryChange={setBranchQuery}
              type={type}
              onTypeChange={setType}
              branches={branches}
              positions={positions}
              isLoading={isLoading}
              error={error}
            />
          </div>
          <div className="overflow-y-auto flex-1">
            <MemberList
              emailQuery={emailQuery}
              branchQuery={branchQuery}
              type={type}
              onSelect={onSelect}
              onUnselect={onUnselect}
              selectedUsers={selectedUsers}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberModal;
