import { atom } from 'recoil';

export interface ConnectModalState {
    isOpen: boolean;
}

const defaultModalState: ConnectModalState = {
    isOpen: false,
};

export const connectModalState = atom<ConnectModalState>({
    key: 'connectModalState',
    default: defaultModalState,
});