import { Grid } from '@mui/material';
import type { propsFormRow } from '../types/Form';

export function FormItemRow(props: propsFormRow) {
    return (
        <Grid
            size={{ xs: props.xs, md: props.md, sm: props.sm }}
            sx={{ marginTop: props.marginTop }}
        >
            {props.children}
        </Grid>
    );
}