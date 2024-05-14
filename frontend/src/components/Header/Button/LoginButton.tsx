import {useState} from 'react';
import {Button, LogInModal} from '@components';
import {User} from '@providers';

interface LogInButtonProps {
  user: User | null;
}

export const LogInButton = ({ user }: LogInButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    if (!user) {
      setIsModalOpen(true);
    } else {
      window.location.reload();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button className='w-24 h-10' onClick={handleOpenModal}>
        Log In
      </Button>
      <LogInModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};
