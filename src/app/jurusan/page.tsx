'use client';
import { useState } from 'react';
import { AddJurusanDialog } from './AddJurusanDialog';
import { useGetAllJurusan } from '@/hooks/useGetAllJurusan';
import { DeleteJurusanDialog } from './DeleteJurusanDialog';
import { JurusanTable } from './JurusanTable';
import { LoadingSpinner } from '@/shared-components/LoadingSpinner';
import { Message } from 'primereact/message';
import { JurusanToolbar } from './JurusanToolbar';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primeicons/primeicons.css';
import sharedStyles from '../shared.module.css';

export default function Page() {
    const { data: allJurusan, isLoading, isError } = useGetAllJurusan();
    const [showAddJurusanDialog, setShowAddJurusanDialog] = useState(false);
    const [jurusanToDelete, setJurusanToDelete] = useState<Jurusan | null>(
        null
    );
    const [showDeleteJurusanDialog, setShowDeleteJurusanDialog] =
        useState(false);

    const confirmDeleteJurusan = (jurusan: Jurusan) => {
        setJurusanToDelete(jurusan);
        setShowDeleteJurusanDialog(true);
    };

    return (
        <div>
            <AddJurusanDialog
                visible={showAddJurusanDialog}
                onHide={() => {
                    setShowAddJurusanDialog(false);
                }}
            />
            <DeleteJurusanDialog
                visible={showDeleteJurusanDialog}
                onHide={() => {
                    setShowDeleteJurusanDialog(false);
                }}
                jurusanToDelete={jurusanToDelete}
            />
            <div className={sharedStyles.mediumTableStyle}>
                <JurusanToolbar
                    onAddJurusanClick={() => {
                        setShowAddJurusanDialog(true);
                    }}
                />
                {isLoading ? (
                    <LoadingSpinner message="Loading jurusan data" />
                ) : isError ? (
                    <Message
                        severity="error"
                        text="An error occurred while fetching jurusan data"
                    />
                ) : (
                    <JurusanTable
                        allJurusan={allJurusan!}
                        onDeleteJurusan={confirmDeleteJurusan}
                    />
                )}
            </div>
        </div>
    );
}
