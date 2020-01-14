import { Constraint, Expression, Operator, Strength, Variable} from 'flightlessbird.js';
import { Solver } from 'flightlessbird.js';

import { Attribute, ILayoutViewTree } from '../views';
import { ILayoutSolver } from "./ILayoutSolver";

export class LayoutSolver extends Solver implements ILayoutSolver {
    /// The root of the view hierarchy being solved over.
    readonly root: ILayoutViewTree;

    /// Index for all variables by name (e.g. 'foo.left').
    readonly variableMap: Map<string, Variable>;

    /// Index for all views by name (e.g. 'foo').
    private _viewMap: Map<string, ILayoutViewTree>;

    public getVariable(name: string): Variable | undefined {
        return this.variableMap.get(name);
    }

    public getVariables(...names: Array<string>): Array<Variable | undefined> {
        return names.map((name) => this.getVariable(name));
    }

    public getView(name: string): ILayoutViewTree | undefined {
        return this._viewMap.get(name);
    }

    constructor(root: ILayoutViewTree) {
        super();

        const views = Array.from(root);
        const attrs = Object.values(Attribute);

        this.root = root;
        const viewMap = this._viewMap = new Map(
            views.map((view: ILayoutViewTree) => {
                return [view.name, view];
            })
        );

        // Create all of the necessary variables.
        const variableMap = this.variableMap = new Map(
            views.flatMap((view: ILayoutViewTree) => {
                return attrs.map((attr) => {
                    const name = `${view.name}.${attr}`;
                    return [name, new Variable(name)];
                })
            })
        );

        // Add the axiomatic constraints, e.g. width = right - left, width >= 0.
        for (const view of viewMap.values()) {
            let [left, top, right, bottom, width, height] = attrs.map((attr) => {
                return variableMap.get(`${view.name}.${attr}`)!;
            });

            let widthAxiomRHS = new Expression(right.minus(left));
            let widthAxiom = new Constraint(
                width, Operator.Eq, widthAxiomRHS,
                Strength.required
            );

            let positiveWidthAxiom = new Constraint(width, Operator.Ge, new Expression(0));

            let heightAxiomRHS = new Expression(bottom.minus(top));
            let heightAxiom = new Constraint(
                height, Operator.Eq, heightAxiomRHS,
                Strength.required
            );

            let positiveHeightAxiom = new Constraint(height, Operator.Ge, new Expression(0));

            this.addConstraint(positiveWidthAxiom);
            this.addConstraint(widthAxiom);
            this.addConstraint(positiveHeightAxiom);
            this.addConstraint(heightAxiom);
        }
    }

    updateView(): void {
        for (const view of this.root) {
            for (const attr of Attribute.writables) {
                const variable = this.variableMap.get(`${view.name}.${attr}`);
                if (variable === undefined) {
                    throw new Error(`unknown variable ${view.name}.${attr}`);
                }
                view[attr] = variable.value();
            }
        }
    }
}
