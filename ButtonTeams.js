// ==UserScript==
// @name         Tasto Teams per ServiceNow (Costruzione Email)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Crea una chat Teams in base al nome del ticket aperto
// @author       Tu
// @match        https://*.service-now.com/incident.do*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function aggiungiBottoneTeams() {
        if (document.getElementById('btn-custom-teams')) return;

        let header = document.querySelector('.navbar-header') || document.body;

        let btn = document.createElement('button');
        btn.id = 'btn-custom-teams';
        btn.innerHTML = '💬 Chat Teams';
        btn.style.cssText = 'margin-left: 15px; background-color: #6264A7; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 14px;';

        btn.onclick = function(e) {
            e.preventDefault();

            if (typeof g_form !== 'undefined') {
                let ticketNum = g_form.getValue('number');

                // Estrae il nome visibile, es: "Riccardo Pallado"
                let chiamante = g_form.getDisplayBox('caller_id').value;
                let nomeChiamante = chiamante.split(' ')[0];
                let shortDescription = g_form.getValue('short_description')


                if (chiamante) {
                    // Elaborazione della stringa di testo
                    let emailCostruita = chiamante
                        .toLowerCase()               // 1. Trasforma in "riccardo pallado"
                        .trim()                      // 2. Rimuove eventuali spazi a inizio/fine
                        .replace(/'/g, '')           // 3. Rimuove eventuali apostrofi (es. D'Amico -> damico)
                        .replace(/\s+/g, '_')        // 4. Sostituisce gli spazi interni con l'underscore "_"
                        + "@despar.it";              // 5. Aggiunge il dominio aziendale

                    let messaggio = encodeURIComponent("Ciao " + nomeChiamante + ", Ti scrivo per il ticket : " + ticketNum + ", Descrizione: " + shortDescription + ".\n Mandami pure il codice Teamviewer cosi posso collegarmi al pc e verificare.");
                    let urlTeams = "https://teams.microsoft.com/l/chat/0/0?users=" + emailCostruita + "&message=" + messaggio;
                    console.log(nomeChiamante)



                    window.open(urlTeams, '_blank');
                } else {
                    alert("Campo chiamante vuoto. Impossibile generare l'email.");
                }
            } else {
                alert("Script eseguito fuori dal contesto del form (API g_form mancante).");
            }
        };

        header.appendChild(btn);
        return true
    }


    // Sistema di sicurezza: spegne il radar dopo 10 secondi per evitare loop infiniti se la pagina va in errore
    setTimeout(aggiungiBottoneTeams(), 2000);
})();