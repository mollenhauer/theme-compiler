import {default as color} from "tinycolor2";
import tinycolor from "tinycolor2";
import merge from "ts-deepmerge";

const tinycolorPrototype = Object.getPrototypeOf(tinycolor('red'))


export type ThemeProperty = {
    color?: string
    fontStyle?: string
 }

function string2HexColor( colorstring: string) {
    return color(colorstring).toHexString()
}
function tinyColor2String( i: tinycolor.Instance) {
    if (i.getAlpha()==1.0) return i.toHexString()
    if (i.getAlpha() <1.0) return i.toHex8String()
}

export type formatFunctionValue = tinycolor.Instance | string | ThemeProperty

function parseProperties(props: formatFunctionValue[]) : ThemeProperty {
    const isPlainObject = (value:any) => value?.constructor === Object;
    const isTinyColor = (o:formatFunctionValue) => Object.getPrototypeOf(o) === tinycolorPrototype
    const parsedProps = props.map(p => {
        if (typeof p === 'string' && (p == 'normal' || p == 'bold' || p == 'italic' || p == 'underline')) {
            return { fontStyle: p }
        } else if (typeof p === 'string') {
            return { color: string2HexColor(p) }
        } else if ( isTinyColor(p) ) {
            return { color: tinyColor2String(p as tinycolor.Instance) }
        } else if (isPlainObject(p)) {
            return p as ThemeProperty
        }
    }).filter( o => o !== undefined) as ThemeProperty[]
    return merge(...parsedProps)
}


interface ThemeOutputColors {
    colors: {
        [k: string]: string
    }
}
interface ThemeOutputSemantic {
    semanticTokenColors: {
        [k: string]: string
    }
}
interface ThemeOutputTextmate {
    "tokenColors": [{
        scope: string
        "settings": {
            foreground: string
            fontStyle?: string
        }
    }]
}

export type ThemeOutput = ThemeOutputColors | ThemeOutputSemantic | ThemeOutputTextmate | {}

function createColorEntry( scope:string, {color}: ThemeProperty ) : ThemeOutput {
    return {
        "colors": {
            [scope]: color||''
        }
    }
}

function createSemanticEntry( scope: string, {color}:ThemeProperty ) : ThemeOutput {
    if (!color) return {}
    return {
        "semanticTokenColors": {
            [scope]: color
        }
    }
}
function createTextmate( scope: string, {color, fontStyle}: ThemeProperty ) : ThemeOutput {
    return {
        "tokenColors" : [
            {
                "scope": scope,
                "settings": {
                    "foreground": color,
                    ...(fontStyle ? {fontStyle} : {})
                }
            }
        ]
    }
}


function parseFormatFunctionParams( fullScope: string, properties: formatFunctionValue[] ) : ThemeOutput {
    const props = parseProperties(properties)
    const dot = "."
    let [prefixScope, ...s] = fullScope.split(dot)
    const suffixScope = s.join(dot)

    if (prefixScope == 'colors'  ) return createColorEntry(    suffixScope, props)
    if (prefixScope == 'semantic') return createSemanticEntry( suffixScope, props)
    return createTextmate( fullScope, props)
}


export type formatFunction = (name: string, ...properties: formatFunctionValue[]) => ThemeOutput;

export function format(combinedScope: string, ...properties: formatFunctionValue[]) : ThemeOutput {
    return parseFormatFunctionParams(combinedScope, properties)
}
