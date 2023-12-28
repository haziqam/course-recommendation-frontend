import { showError, showSuccess } from '@/util/toastFunctions'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { useState, useEffect } from 'react'

export function AddFakultasDialog(props: {
    visible: boolean
    onHide: () => void
    onSubmitSuccess: () => void
    toastRef: React.RefObject<Toast>
}) {
    const [newFakultasName, setNewFakultasName] = useState('')

    useEffect(() => {
        setNewFakultasName('')
    }, [props.visible])

    return (
        <Dialog
            header="Tambahkan fakultas baru"
            pt={{ header: { style: { paddingBottom: '0' } } }}
            visible={props.visible}
            style={{ width: '35vw' }}
            onHide={props.onHide}
            blockScroll
        >
            <span className="p-float-label" style={{ marginTop: '24px' }}>
                <InputText
                    id="a"
                    value={newFakultasName}
                    onChange={(e) => {
                        setNewFakultasName(e.target.value)
                    }}
                />
                <label htmlFor="a">Nama Fakultas</label>
            </span>
            <Button
                label="Save"
                pt={{ root: { style: { marginTop: '24px' } } }}
                icon="pi pi-check"
                disabled={newFakultasName === ''}
                onClick={(e) => {
                    const postData = async () => {
                        const result = await addFakultas([
                            { namaFakultas: newFakultasName },
                        ])
                        if (!result.success) {
                            showError(
                                props.toastRef,
                                `Gagal menambahkan fakultas: ${result.errorMsg}. Pastikan atribut JSON valid dan lengkap,` +
                                    ' serta atribut fakultas unik'
                            )
                            return
                        }
                        props.onSubmitSuccess()
                        showSuccess(
                            props.toastRef,
                            'Berhasil menambahkan fakultas'
                        )
                    }
                    postData()
                    props.onHide()
                }}
            />
        </Dialog>
    )
}

async function addFakultas(fakultas: Fakultas[]) {
    try {
        const response = await fetch('http://localhost:5000/fakultas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fakultas),
        })
        if (!response.ok) {
            const errorMsg = await response.json()
            return { success: false, errorMsg: errorMsg.error as string }
        }
        return { success: true }
    } catch (error) {
        return { success: false, errorMsg: (error as Error).message }
    }
}
