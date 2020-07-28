import { ILayoutViewTree } from '../views';

import { ConstraintParser } from '../solver';

type fetchOpts = {
    height: MockdownClient.IBound,
    width: MockdownClient.IBound
}

export class MockdownClient {
    private _host: string;
    private _port: string;
    private _synthesizeEndpoint: string;

    constructor(options: MockdownClient.IOptions) {
        let { host, port } = options;
        host = this._host = host || 'localhost';
        port = this._port = port || '8000';

        this._synthesizeEndpoint = `http://${host}:${port}/api/synthesize`;
    }

    

    async fetch(examples: Array<ILayoutViewTree.POJO>, opts: fetchOpts, unambig: boolean, filter: MockdownClient.SynthType = MockdownClient.SynthType.NONE): Promise<ConstraintParser.IConstraintJSON[]> {
        // console.log(filter);
        const bounds = {
            'min_w': opts.width.lower,
            'max_w': opts.width.upper,
            'min_h': opts.height.lower,
            'max_h': opts.height.upper,
        };
        // console.log(bounds);
        const body = JSON.stringify({ 'examples': examples, 'pruning': filter, 'bounds': bounds, 'unambig': unambig});

        const response = await fetch(this._synthesizeEndpoint, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: body
        });

        return response.json();
    }
}

export namespace MockdownClient {
    export interface IOptions {
        host?: string
        port?: string
    }
    export enum SynthType {
        NONE = "none",
        BASE = "baseline",
        HIER = "hierarchical",
        CEGIS = "cegis"
    }
    export interface IBound {
        lower: number,
        upper: number
    }
}
