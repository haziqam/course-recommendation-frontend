'use client';
import { useState } from 'react';
import { MatkulTable } from './MatkulTable';
import { AddMatkulDialog } from './AddMatkulDialog';
import { useGetAllMatkul } from '@/hooks/useGetAllMatkul';
import sharedStyles from '../shared.module.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primeicons/primeicons.css';
import { MatkulToolbar } from './MatkulToolbar';
import { LoadingSpinner } from '@/shared-components/LoadingSpinner';
import { Message } from 'primereact/message';
import { DeleteMatkulDialog } from './DeleteMatkulDialog';

export default function Page() {
    const { data: allMatkul, isLoading, isError } = useGetAllMatkul();
    const [showAddMatkulDialog, setShowAddMatkulDialog] = useState(false);
    const [showDeleteMatkulDialog, setShowDeleteMatkulDialog] = useState(false);
    const [matkulToDelete, setMatkulToDelete] = useState<Matkul | null>(null);

    const confirmDeleteMatkul = (matkul: Matkul) => {
        setMatkulToDelete(matkul);
        setShowDeleteMatkulDialog(true);
    };

    return (
        <div>
            <AddMatkulDialog
                visible={showAddMatkulDialog}
                onHide={() => {
                    setShowAddMatkulDialog(false);
                }}
            />
            <DeleteMatkulDialog
                visible={showDeleteMatkulDialog}
                onHide={() => {
                    setShowDeleteMatkulDialog(false);
                }}
                matkulToDelete={matkulToDelete}
            />
            <div className={sharedStyles.tableStyle}>
                <MatkulToolbar
                    onAddJurusanClick={() => {
                        setShowAddMatkulDialog(true);
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
                    <MatkulTable
                        allMatkul={allMatkul!}
                        onDeleteMatkul={confirmDeleteMatkul}
                    />
                )}
            </div>
        </div>
    );
}
