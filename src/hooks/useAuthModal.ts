import { useRecoilState } from 'recoil';
import { authModalState } from '../atoms/authModalAtom';

const useAuthModal = () => {
    const [modalState, setModalState] = useRecoilState(authModalState);

    const openModal = (view: 'login' | 'signup' | 'resetPassword') => {
        setModalState({ isOpen: true, view });
    };

    const closeModal = () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
    };

    return {
        ...modalState,
        openModal,
        closeModal,
        setModalState,
    };
};

export default useAuthModal;
