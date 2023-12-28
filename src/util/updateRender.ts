export function updateRender(
    elementRenderHelper: boolean,
    elementRenderHelperSetter: React.Dispatch<React.SetStateAction<boolean>>
) {
    elementRenderHelperSetter(!elementRenderHelper)
}
