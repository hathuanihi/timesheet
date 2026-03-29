import React, { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Search } from '@/components/ui/search';
import Loading from '@/components/ui/loading';
import { getAllCustomersAPI } from '@/services/customer.service';
import { ICustomerResponse } from '@/types/customer.type';
import { getErrorMessage } from '@/utils/errorHandler';
import { toast } from 'sonner';
import useModal from '@/hooks/useModal';

type ClientSelectorProps = {
  value?: number;
  onChange?: (value: number | undefined) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onAddClientClick?: () => void;
  reloadKey?: number;
  error?: string;
};

export const ClientSelector: React.FC<ClientSelectorProps> = ({
  value,
  onChange,
  onBlur,
  placeholder = 'Select a client...',
  className,
  disabled,
  onAddClientClick,
  error,
  reloadKey,
}) => {
  const { isOpen, toggleModal } = useModal();
  const [searchQuery, setSearchQuery] = useState('');

  const [allClients, setAllClients] = useState<ICustomerResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAllClients = async () => {
      setIsLoading(true);
      try {
        const result = await getAllCustomersAPI();
        setAllClients(result ?? []);
      } catch (e) {
        const errorMessage = getErrorMessage(e, 'Could not fetch clients');
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllClients();
  }, [reloadKey]);

  const filteredClients = useMemo(() => {
    if (!searchQuery) {
      return allClients;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return allClients.filter(
      (client) =>
        client.name.toLowerCase().includes(lowercasedQuery) ||
        client.code.toLowerCase().includes(lowercasedQuery),
    );
  }, [allClients, searchQuery]);

  const selectedClient = useMemo(
    () => allClients.find((c) => c.id === value) || null,
    [allClients, value],
  );

  const handleSelectClient = (client: ICustomerResponse) => {
    onChange?.(client.id);
    onBlur?.();
    toggleModal();
  };

  const displayValue = selectedClient
    ? `${selectedClient.name} - ${selectedClient.code}`
    : placeholder;

  return (
    <div className="flex flex-col">
      <div className="flex items-start gap-3">
        <div className="flex flex-col">
          <Popover open={isOpen} onOpenChange={toggleModal}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isOpen}
                aria-invalid={!!error}
                className={cn(
                  'w-[260px] justify-between hover:bg-transparent font-normal hover:text-muted-foreground',
                  displayValue === placeholder
                    ? 'text-muted-foreground'
                    : 'text-foreground',
                  !!error && 'ring-destructive/20 border-destructive ',
                  className,
                )}
                disabled={disabled}
              >
                {isLoading && !selectedClient
                  ? 'Loading clients...'
                  : displayValue}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[290px] p-0">
              <div className="flex flex-col">
                <div className="sticky top-0 z-10 border-b bg-popover p-2">
                  <Search
                    placeholder="Search clients..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                  />
                </div>
                <div className="max-h-70 overflow-y-auto p-1 overflow-x-hidden">
                  {isLoading && <Loading />}
                  {!isLoading && !error && filteredClients.length === 0 && (
                    <p className="p-2 text-sm text-muted-foreground">
                      No clients found.
                    </p>
                  )}
                  {filteredClients.map((client) => (
                    <Button
                      key={client.id}
                      variant="ghost"
                      className="w-full justify-start font-normal h-auto py-2"
                      onClick={() => handleSelectClient(client)}
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-medium">{client.name}</span>
                        <span className="text-muted-foreground">
                          - {client.code}
                        </span>
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <div className="h-3 mt-1 text-right w-[260px]">
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        </div>

        <div>
          <Button
            type="button"
            variant="default"
            size="sm"
            className="px-3"
            onClick={onAddClientClick}
            disabled={disabled}
          >
            Add Client
          </Button>
        </div>
      </div>
    </div>
  );
};
