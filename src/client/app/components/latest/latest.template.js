import { Util } from "../../util.js";
import { ToastsComponent } from "../toasts/toasts.component.js";

export class LatestTemplate {
    static update(render) {
        workway("node://finance.js").then(async({ namespace: finance }) => {
            /* eslint-disable indent */
            render`
                <h2>Latest Portfolios ${{
                    any: finance.getPortfolioCount().then(data => {
                        if (data.rows && !data.rows.length) {
                            hyperHTML.wire()`<span>(total 0)</span>`;
                        }

                        return hyperHTML.wire()`<span>(total ${data.rows && data.rows[0].value})</span>`;
                    }).catch(err => ToastsComponent.update({ message: err.message || err })),
                    placeholder: "Loading count..."
                }}</h2>

                ${{
                    any: finance.getLastCreatedPortfolios(20).then(data => {
                        const headerClasses = "fw6 bb b--black-20 tl pb1 pr1 bg-black-10 tr";
                        const trClasses = "pv1 pr1 bb b--black-20 tr";

                        return hyperHTML.wire()`
                            <table class="f7 w-100 mw8 pa2">
                                <thead>
                                    <th class="${headerClasses}">To Date</th>
                                    <th class="${headerClasses}">Reference Date</th>
                                    <th class="${headerClasses}">Assets</th>
                                    <th class="${headerClasses}">Perf</th>
                                    <th class="${headerClasses}">Risk</th>
                                    <th class="${headerClasses}">Ret</th>
                                </thead>

                                <tbody>${data.rows.map(ptf =>
                                    hyperHTML.wire(ptf, ":tr")`<tr>
                                        <td class="${trClasses}">${ptf.key}</td>
                                        <td class="${trClasses}">${ptf.value.ref}</td>
                                        <td class="${trClasses}">${ptf.value.assets.map((asset, index) => `
                                            <b>${asset}</b><span>(${Util.formatNumber(ptf.value.weights[index] * 100, 1)}%)</span>
                                        `)}</td>
                                        <td class="${trClasses}"><b>${Util.formatNumber(ptf.value.perf * 100, 1)}%</b></td>
                                        <td class="${trClasses}">${Util.formatNumber(ptf.value.risk * 100, 1)}%</td>
                                        <td class="${trClasses}">${Util.formatNumber(ptf.value.ret * 100, 1)}%</td>
                                    </tr>`)
                                }</tbody>
                            </table>
                        `;
                    }).catch(err => ToastsComponent.update({ message: err.message || err })),
                    placeholder: "Loading..."
                }}
            `;
            /* eslint-enable indent */
        });
    }
}
