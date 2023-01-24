export {default as tinycolor2} from "tinycolor2";

// import {ColorInput} from "tinycolor2";
import merge from "ts-deepmerge";
import { formatFunctionValue, ThemeOutput, formatFunction, format as format_org } from "./format";
export  { ThemeProperty } from "./format";

import {default as fs} from 'fs'
import {jsonc} from 'jsonc'

// interface Theme<T = any> {
//     [key: string]: T;
// }

function loadJsonc( filename: string ) {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        return jsonc.parse(data)
    } catch (error) {
        console.log( `${filename}: ${error}` )
    }
}

export class Theme {
    themeEntries: Array<ThemeOutput>
    prefixFiles: string[]

    constructor( prefixFiles?: string[]) {
        this.themeEntries = []
        this.prefixFiles = prefixFiles || []
    }

    format(combinedScope: string, ...properties: formatFunctionValue[]) : ThemeOutput {
        const to = format_org(combinedScope, ...properties);
        this.themeEntries.push(to)
        return to
    }

    read_prefixFiles() {
        return this.prefixFiles.map(loadJsonc)
    }

    combine() {
        return merge(
            ...this.read_prefixFiles(),
            ...Object.values(this.themeEntries)
        )
    }

    output() {
        return JSON.stringify(this.combine(), null, 2 )
    }

    static create( prefixFiles: string[] ) : [Theme, formatFunction] {
        const t = new Theme( prefixFiles )
        return [t, t.format.bind(t)]
    }

}