'use client';
import { useState } from 'react';
import { AddFakultasDialog } from './AddFakultasDialog';
import { useGetAllFakultas } from '@/hooks/useGetAllFakultas';
import { DeleteFakultasDialog } from './DeleteFakultasDialog';
import { FakultasToolbar } from './FakultasToolbar';
import { FakultasTable } from './FakultasTable';
import { LoadingSpinner } from '@/shared-components/LoadingSpinner';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primeicons/primeicons.css';
import sharedStyles from '../shared.module.css';
import { Message } from 'primereact/message';

export default function Page() {
    const { data: allFakultas, isLoading, isError } = useGetAllFakultas();
    const [showAddFakultasDialog, setShowAddFakultasDialog] = useState(false);
    const [fakultasToDelete, setFakultasToDelete] = useState<Fakultas | null>(
        null
    );
    const [showDeleteFakultasDialog, setShowDeleteFakultasDialog] =
        useState(false);
    const confirmDeleteFakultas = (fakultas: Fakultas) => {
        setFakultasToDelete(fakultas);
        setShowDeleteFakultasDialog(true);
    };

    return (
        <>
            <AddFakultasDialog
                visible={showAddFakultasDialog}
                onHide={() => {
                    setShowAddFakultasDialog(false);
                }}
            />
            <DeleteFakultasDialog
                visible={showDeleteFakultasDialog}
                onHide={() => {
                    setShowDeleteFakultasDialog(false);
                }}
                fakultasToDelete={fakultasToDelete}
            />
            <div className={sharedStyles.smallTableStyle}>
                <FakultasToolbar
                    onAddFakultasClick={() => {
                        setShowAddFakultasDialog(true);
                    }}
                />
                {isLoading ? (
                    <LoadingSpinner message="Loading fakultas data" />
                ) : isError ? (
                    <Message
                        severity="error"
                        text="An error occurred while fetching fakultas data"
                    />
                ) : (
                    <FakultasTable
                        allFakultas={allFakultas!}
                        onDeleteFakultas={confirmDeleteFakultas}
                    />
                )}
            </div>
        </>
    );
}
