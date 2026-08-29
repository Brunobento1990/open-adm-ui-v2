import { alpha, decomposeColor } from '@mui/material';
import { BoxApp } from '../BoxApp/BoxApp';
import {
    BoxAppAlignItems,
    BoxAppDisplay,
    BoxAppJustifyContent,
    BoxAppTextAlign,
} from '../BoxApp/boxAppTypes';
import { TextApp } from '../TextApp/TextApp';


interface propsBadgeApp {
    width?: string;
    height?: string;
    cor: string;
    texto: string;
    padding?: string;
    fontSize?: string;
    maxWidth?: string;
}

// Deriva um tom de texto sempre forte a partir da cor recebida: mesma matiz,
// saturação com piso alto e lightness fixa escura. Garante o contraste do
// badge "soft" mesmo quando a cor de entrada é clara/pouco saturada.
function corTextoForte(cor: string): string {
    try {
        const { type, values } = decomposeColor(cor);
        let h = 0;
        let s = 0;

        if (type.indexOf('hsl') === 0) {
            h = values[0];
            s = values[1];
        } else {
            const r = values[0] / 255;
            const g = values[1] / 255;
            const b = values[2] / 255;
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const d = max - min;
            const l = (max + min) / 2;

            if (d !== 0) {
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                if (max === r) {
                    h = (g - b) / d + (g < b ? 6 : 0);
                } else if (max === g) {
                    h = (b - r) / d + 2;
                } else {
                    h = (r - g) / d + 4;
                }
                h *= 60;
            }
            s *= 100;
        }

        const saturacao = Math.max(s, 60);
        return `hsl(${Math.round(h)}, ${Math.round(saturacao)} %, 45 %)`;
    } catch {
        return cor;
    }
}

export function BadgeApp(props: propsBadgeApp) {
    return (
        <BoxApp
            maxWidth={props.maxWidth}
            width={props.width}
            height={props.height}
            backgroundColor={alpha(props.cor, 0.16)}
            borderRadius='5px'
            padding={props.padding}
            textAlign={BoxAppTextAlign.Center}
            display={BoxAppDisplay.Flex}
            alignItems={BoxAppAlignItems.Center}
            justifyContent={BoxAppJustifyContent.Center}
        >
            <TextApp
                color={corTextoForte(props.cor) as any}
                fontSize={props.fontSize}
                fontWeight={600}
            >
                {props.texto}
            </TextApp>
        </BoxApp>
    );
}
