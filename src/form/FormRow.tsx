import { Box, Grid } from '@mui/material';
import type { propsFormRow } from '../types/Form';

export function FormRow(props: propsFormRow) {
    return (
        <Box
            sx={{
                marginBottom: props.marginBotton ?? '12px',
                width: props.width,
                padding: props.padding,
                marginTop: props.marginTop ?? '5px',
                borderBottom: props.borderBottom,
                backgroundColor: props.backGroudnColor,
                borderRadius: props.borderRadius,
            }}
        >
            <Grid
                container
                spacing={props.spacing ?? 3}
                direction={props.direction as any}
            >
                {props.children}
            </Grid>
        </Box>
    );
}
