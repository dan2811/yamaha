import { api } from "~/trpc/react";
import AdminButton from "~/app/_components/admin/Button";;
import ConfirmationModal from "./ConfirmationModal";
import { useState } from 'react';
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  roomId: string;
}

const DeleteRoomButton: React.FC<DeleteButtonProps> = ({ roomId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const deleteItem = api.rooms.delete.useMutation({
    onMutate: () => setIsLoading(true),
    onSuccess: () => {
      setIsLoading(false);
      setIsModalOpen(false);
      alert('Item deleted successfully');
      router.push('/admin/settings/rooms')
    },
    onError: (error) => {
      setIsLoading(false);
      alert(`Failed to delete: ${error.message}`);
    }
  });

  const handleDeleteClick = () => setIsModalOpen(true);

  const handleConfirmDelete = () => {
    deleteItem.mutate({ id: roomId });
  };

  return (
    <>
      <AdminButton onClick={handleDeleteClick} disabled={isLoading} >
      ❌ Delete this room
      </AdminButton>
      
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsModalOpen(false)}
        isLoading={isLoading}
      />
    </>
  );
};

export default DeleteRoomButton;