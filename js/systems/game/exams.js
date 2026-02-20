// ============================================================
// combat/exams.js — Exámenes Chunin y Jonin
// ============================================================

export const examsMethods = {

    // ── Helpers ──────────────────────────────────────────────

    getExamTypeForRank(rank) {
        if (rank === 'Genin')  return 'chunin';
        if (rank === 'Chunin') return 'jonin';
        return null;
    },

    getExamTitle(type) { return type === 'jonin' ? 'Examen Jonin' : 'Examen Chunin'; },

    isExamDay() {
        return this.player.location === 'konoha' && this.player.day === 1
            && (this.player.month === 1 || this.player.month === 7);
    },

    // ── Countdown widget ─────────────────────────────────────

    async showExamCountdown() {
        const el = document.getElementById('exam-widget');
        if (!el || !this.player) return;

        const type = this.getExamTypeForRank(this.player.rank);
        if (!type) {
            el.innerHTML = '<div style="opacity:0.8;">📅 PRÓXIMO EXAMEN: <b>—</b> (ya eres Jonin o superior)</div>';
            return;
        }

        const nowAbs        = this.getAbsoluteDay();
        const nextAbs       = this.getNextExamAbsoluteDay(nowAbs);
        const daysLeft      = Math.max(0, nextAbs - nowAbs);
        const cooldownUntil = this.player.examCooldowns?.[type] || 0;
        const cooldownLeft  = Math.max(0, cooldownUntil - nowAbs);
        const today         = this.isExamDay();
        const canAttempt    = today && cooldownLeft === 0;

        const timeText = cooldownLeft > 0
            ? `Próximo intento en ${cooldownLeft} día(s)`
            : (daysLeft === 0 ? 'HOY' : `En ${daysLeft} día(s)`);

        el.innerHTML = `
            <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap;">
                <div>
                    <div style="color:var(--gold); font-weight:bold;">📅 PRÓXIMO EXAMEN</div>
                    <div style="margin-top:4px;"><b>${this.getExamTitle(type)}</b></div>
                    <div style="margin-top:4px; opacity:0.9;">⏰ ${timeText}</div>
                </div>
                <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">
                    <button class="btn btn-small btn-secondary" onclick="game.showExamRequirements()">Ver Requisitos</button>
                    <button class="btn btn-small" ${canAttempt ? '' : 'disabled'} onclick="game.enrollInExam()">Inscribirse</button>
                </div>
            </div>
        `;
    },

    async checkExamDay() {
        if (!this.player) return;
        const type = this.getExamTypeForRank(this.player.rank);
        if (!type) return;

        const nowAbs   = this.getAbsoluteDay();
        const nextAbs  = this.getNextExamAbsoluteDay(nowAbs);
        const daysLeft = Math.max(0, nextAbs - nowAbs);

        const notifyDays = new Set([30, 14, 7, 3, 1, 0]);
        if (notifyDays.has(daysLeft) && this.player.lastExamNoticeAbsDay !== nowAbs) {
            this.player.lastExamNoticeAbsDay = nowAbs;
            const title = this.getExamTitle(type);
            if (daysLeft === 0) alert(`🎯 ¡HOY es el ${title}! Ve a la Aldea y presiona "Inscribirse".`);
            else                alert(`📅 ${title}: faltan ${daysLeft} día(s).`);
            this.saveGame();
        }
    },

    async showExamRequirements() {
        if (!this.player) return;
        const type = this.getExamTypeForRank(this.player.rank);
        if (!type) { this.gameAlert('No tienes exámenes pendientes.', '❌'); return; }
        alert(type === 'chunin'
            ? '📜 Requisitos Examen Chunin\n\n- Rango: Genin\n- 2 misiones rango A completadas\n- 2 misiones rango B completadas\n- 2000 Ryo (inscripción)\n- No haber fallado en los últimos 180 días'
            : '📜 Requisitos Examen Jonin\n\n- Rango: Chunin\n- 5 misiones rango S completadas (siendo Chunin)\n- 8000 Ryo (inscripción)\n- No haber fallado en los últimos 180 días'
        );
    },

    async enrollInExam() {
        if (!this.player) return;
        const type = this.getExamTypeForRank(this.player.rank);
        if (!type) { alert('No tienes exámenes pendientes.'); return; }
        if (!this.isExamDay()) { alert('Hoy no es día de examen.'); return; }

        const nowAbs        = this.getAbsoluteDay();
        const cooldownUntil = this.player.examCooldowns?.[type] || 0;
        if (cooldownUntil > nowAbs) {
            alert(`Aún no puedes intentarlo. Próximo intento en ${cooldownUntil - nowAbs} día(s).`);
            return;
        }

        const ok = this.checkExamRequirements(type, true);
        if (!ok) return;

        this.player.examState = { active: true, type, phase: 'intro', data: {} };
        this.saveGame();
        if (type === 'chunin') this.startChuninExam();
        else                   this.startJoninExam();
    },

    checkExamRequirements(type, chargeFee = false) {
        const byRank = this.player.missionsCompletedByRank || {};
        if (type === 'chunin') {
            if (this.player.rank !== 'Genin') return alert('Solo Genin puede intentar el examen Chunin.'), false;
            if ((byRank.A || 0) < 2)          return alert('Requiere 2 misiones rango A completadas.'),    false;
            if ((byRank.B || 0) < 2)          return alert('Requiere 2 misiones rango B completadas.'),    false;
            if (this.player.ryo < 2000)       return alert('Requiere 2000 Ryo para inscribirse.'),         false;
            if (chargeFee) this.player.ryo -= 2000;
            return true;
        }
        if (this.player.rank !== 'Chunin')                         return alert('Solo Chunin puede intentar el examen Jonin.'), false;
        if ((this.player.missionsCompletedSWhileChunin || 0) < 5)  return alert('Requiere 5 misiones rango S completadas.'),    false;
        if (this.player.ryo < 8000)                                return alert('Requiere 8000 Ryo para inscribirse.'),         false;
        if (chargeFee) this.player.ryo -= 8000;
        return true;
    },

    // ── Render helpers ───────────────────────────────────────

    renderExamScreen(html) {
        this.showScreen('exam-screen');
        const el = document.getElementById('exam-content');
        if (el) el.innerHTML = html;
    },

    renderExamFromState() {
        const st = this.player?.examState;
        if (!st?.active) return;
        if (st.type === 'chunin') this.renderChuninExam();
        else                      this.renderJoninExam();
    },

    abandonExam() {
        if (!this.player?.examState?.active) {
            this.showScreen('village-screen');
            this.showSection('home');
            this.updateVillageUI();
            return;
        }
        if (confirm('¿Abandonar el examen? Perderás el intento (cooldown 180 días).')) {
            this.examFail('abandon');
        }
    },

    examFail(reason = 'fail') {
        const type   = this.player?.examState?.type || 'chunin';
        const nowAbs = this.getAbsoluteDay();
        if (!this.player.examCooldowns) this.player.examCooldowns = {};
        this.player.examCooldowns[type] = nowAbs + 180;
        this.player.examState = null;
        this.saveGame();
        const msg = reason === 'abandon' ? 'Abandonaste el examen.' : `Fallaste el Examen ${this.getExamTitle(type)}.`;
        alert(`${msg}\nPodrás intentarlo de nuevo en 180 días.`);
        this.showScreen('village-screen');
        this.showSection('home');
        this.updateVillageUI();
    },

    examPass(type) {
        this.player.examState = null;
        if (type === 'chunin') {
            this.player.rank = 'Chunin';
            this.player.taijutsu += 5;
            this.player.ninjutsu += 5;
            this.player.genjutsu += 5;
            this.player.maxHp    += 50;
            this.player.hp        = this.player.maxHp;
            this.player.maxChakra += 60;
            this.player.chakra    = this.player.maxChakra;
            alert('🎖️ ¡APROBASTE el Examen Chunin!\n\n¡Ahora eres Chunin! Todos tus stats han aumentado.');
        } else {
            this.player.rank = 'Jonin';
            this.player.taijutsu += 10;
            this.player.ninjutsu += 10;
            this.player.genjutsu += 10;
            this.player.maxHp    += 80;
            this.player.hp        = this.player.maxHp;
            this.player.maxChakra += 100;
            this.player.chakra    = this.player.maxChakra;
            alert('🔥 ¡APROBASTE el Examen Jonin!\n\n¡Ahora eres Jonin! Poderes máximos desbloqueados.');
        }
        this.checkJutsuUnlocks(this.player);
        this.saveGame();
        this.showScreen('village-screen');
        this.showSection('home');
        this.updateVillageUI();
    },

    // ════════════════════════════════════════════════════════
    //  EXAMEN CHUNIN
    // ════════════════════════════════════════════════════════

    startChuninExam() {
        if (!this.player?.examState) this.player.examState = { active: true, type: 'chunin', phase: 'intro', data: {} };
        this.renderChuninExam();
    },

    renderChuninExam() {
        const phase = this.player.examState?.phase;

        if (phase === 'intro') return this.renderExamScreen(`
            <div class="story-text">
                <p>Has llegado al Centro de Misiones. Los examinadores te reciben en silencio.</p>
                <p style="margin-top:10px;">El Examen Chunin consta de <b>3 fases</b>: escrito, Bosque de la Muerte y torneo final.</p>
            </div>
            <div style="text-align:center; margin-top:14px;">
                <button class="btn" onclick="game.examWrittenTestStart()">Iniciar Fase 1: Escrito</button>
                <br><br><button class="btn btn-secondary btn-small" onclick="game.abandonExam()">Abandonar</button>
            </div>
        `);

        if (phase === 'written')      return this.renderExamWrittenQuestion();
        if (phase === 'forest_intro') return this.renderExamForestIntro();
        if (phase === 'forest_between') return this.renderExamForestBetween();
        if (phase === 'tournament_intro') return this.renderExamTournamentIntro();
        if (phase === 'tournament_result') return this.renderExamTournamentResult();
        if (phase === 'final_decision') return this.renderExamFinalDecision();
    },

    // ── Fase 1: Prueba escrita ────────────────────────────────

    examWrittenTestStart() {
        const st = this.player.examState;
        st.phase = 'written';
        st.data.writtenAnswers  = [];
        st.data.writtenIndex    = 0;
        this.saveGame();
        this.renderExamWrittenQuestion();
    },

    renderExamWrittenQuestion() {
        const st  = this.player.examState;
        const idx = st.data.writtenIndex || 0;
        const questions = this.examQuestions?.chunin || [];

        if (idx >= questions.length) { this.examWrittenFinish(); return; }

        const q = questions[idx];
        this.renderExamScreen(`
            <div class="story-text">
                <p style="color:var(--gold); font-weight:bold;">FASE 1: PRUEBA ESCRITA — Pregunta ${idx + 1}/${questions.length}</p>
                <p style="margin-top:10px;">${q.question}</p>
            </div>
            <div style="margin-top:14px; display:flex; flex-direction:column; gap:10px;">
                ${q.options.map((opt, i) => `
                    <button class="btn btn-small" style="text-align:left;" onclick="game.examWrittenAnswer(${i})">
                        ${String.fromCharCode(65 + i)}) ${opt}
                    </button>
                `).join('')}
            </div>
            <div style="margin-top:14px; text-align:center;">
                <button class="btn btn-secondary btn-small" onclick="game.abandonExam()">Abandonar</button>
            </div>
        `);
    },

    examWrittenAnswer(optionIndex) {
        const st  = this.player.examState;
        const idx = st.data.writtenIndex || 0;
        const questions = this.examQuestions?.chunin || [];
        const q   = questions[idx];

        if (!st.data.writtenAnswers) st.data.writtenAnswers = [];
        st.data.writtenAnswers.push({ question: q.question, chosen: optionIndex, correct: q.correct });
        st.data.writtenIndex = idx + 1;
        this.saveGame();
        this.renderExamWrittenQuestion();
    },

    examWrittenFinish() {
        const st        = this.player.examState;
        const answers   = st.data.writtenAnswers || [];
        const correct   = answers.filter(a => a.chosen === a.correct).length;
        const total     = answers.length;
        const threshold = Math.ceil(total * 0.6);
        const passed    = correct >= threshold;

        if (!passed) {
            this.renderExamScreen(`
                <div class="story-text">
                    <p style="color:#e74c3c; font-weight:bold;">FASE 1 FALLADA</p>
                    <p style="margin-top:10px;">Respondiste ${correct}/${total} correctas. Necesitas ${threshold}.</p>
                    <p style="margin-top:8px;">Sigue entrenando tu conocimiento teórico.</p>
                </div>
                <div style="text-align:center; margin-top:14px;">
                    <button class="btn" onclick="game.examFail()">Salir</button>
                </div>
            `);
            return;
        }

        st.phase = 'forest_intro';
        st.data.forestIndex = 0;
        this.saveGame();
        this.renderExamScreen(`
            <div class="story-text">
                <p style="color:#2ecc71; font-weight:bold;">✅ FASE 1 SUPERADA</p>
                <p style="margin-top:10px;">Respondiste ${correct}/${total} correctas. ¡Bien hecho!</p>
                <p style="margin-top:8px;">Siguiente: <b>Bosque de la Muerte</b>.</p>
            </div>
            <div style="text-align:center; margin-top:14px;">
                <button class="btn" onclick="game.renderChuninExam()">Continuar</button>
            </div>
        `);
    },

    // ── Fase 2: Bosque de la Muerte ───────────────────────────

    renderExamForestIntro() {
        this.renderExamScreen(`
            <div class="story-text">
                <p style="color:var(--gold); font-weight:bold;">FASE 2: BOSQUE DE LA MUERTE</p>
                <p style="margin-top:10px;">3 combates consecutivos. Tu HP y Chakra <b>no se recuperan</b> entre combates.</p>
                <p style="margin-top:8px;">Puedes usar 1 item del inventario entre combates.</p>
            </div>
            <div style="text-align:center; margin-top:14px;">
                <button class="btn" onclick="game.examForestStartFight()">Iniciar Combate 1</button>
                <br><br><button class="btn btn-secondary btn-small" onclick="game.abandonExam()">Abandonar</button>
            </div>
        `);
    },

    renderExamForestBetween() {
        const st  = this.player.examState;
        const idx = (st.data.forestIndex || 0) + 1;
        this.renderExamScreen(`
            <div class="story-text">
                <p style="color:#2ecc71; font-weight:bold;">✅ Combate ${idx - 1} superado</p>
                <p style="margin-top:10px;">HP: ${Math.floor(this.player.hp)}/${this.player.maxHp} | Chakra: ${Math.floor(this.player.chakra)}/${this.player.maxChakra}</p>
                <p style="margin-top:8px;">Puedes usar 1 item antes del siguiente combate.</p>
            </div>
            <div style="margin-top:14px;">
                ${this.player.inventory.length > 0 ? `
                    <div style="margin-bottom:10px; font-weight:bold;">Inventario:</div>
                    ${this.player.inventory.map((item, i) => `
                        <button class="btn btn-small" style="margin:4px; text-align:left;" onclick="game.examForestUseItem(${i})">
                            Usar ${item.name}
                        </button>
                    `).join('')}
                ` : '<p style="opacity:0.75;">No tienes items.</p>'}
            </div>
            <div style="text-align:center; margin-top:14px;">
                <button class="btn" onclick="game.examForestStartFight()">Continuar (Combate ${idx})</button>
            </div>
        `);
    },

    examForestUseItem(index) {
        const item = this.player.inventory[index];
        if (!item) return;
        if (item.effect?.hp)     this.player.hp     = Math.min(this.player.maxHp,     this.player.hp     + item.effect.hp);
        if (item.effect?.chakra) this.player.chakra = Math.min(this.player.maxChakra, this.player.chakra + item.effect.chakra);
        this.player.inventory.splice(index, 1);
        this.saveGame();
        this.renderExamForestBetween();
    },

    examForestStartFight() {
        const st  = this.player.examState;
        const idx = st.data.forestIndex || 0;

        if (idx >= 3) {
            st.phase = 'tournament_intro';
            this.saveGame();
            this.renderChuninExam();
            return;
        }

        const enemyTemplates = this.examEnemies?.chunin_forest || [];
        const tpl   = enemyTemplates[idx % enemyTemplates.length] || { name:'Rival Ninja', hp:150, chakra:80, attack:20, defense:12, accuracy:10 };
        const scale = 1 + idx * 0.25;
        const enemy = {
            name:     tpl.name,
            hp:       Math.floor(tpl.hp * scale),
            chakra:   tpl.chakra,
            attack:   Math.floor(tpl.attack  * scale),
            defense:  Math.floor(tpl.defense * scale),
            accuracy: tpl.accuracy,
            genjutsu: tpl.genjutsu || 8,
            maxHp:    Math.floor(tpl.hp * scale),
            maxChakra: tpl.chakra,
            controlledTurns: 0,
        };

        this.currentMission = {
            name: `Bosque de la Muerte — Combate ${idx + 1}`,
            rank: 'B', description: 'Examen Chunin, Fase 2.',
            enemies: [], ryo: 0, exp: 0, turns: 0,
            isExamFight: true,
            examMeta: { phase: 'forest', examType: 'chunin', combatIndex: idx },
        };
        this.currentEnemy  = enemy;
        this.enemyQueue    = [];
        this.totalWaves    = 1;
        this.currentWave   = 1;
        this.startCombat();
    },

    // ── Fase 3: Torneo ────────────────────────────────────────

    renderExamTournamentIntro() {
        this.renderExamScreen(`
            <div class="story-text">
                <p style="color:var(--gold); font-weight:bold;">FASE 3: TORNEO FINAL</p>
                <p style="margin-top:10px;">Combate 1 vs 1 contra un rival de tu nivel. HP y Chakra se recuperan al 60%.</p>
                <p style="margin-top:8px;">Incluso si pierdes, el Comité puede promoverte.</p>
            </div>
            <div style="text-align:center; margin-top:14px;">
                <button class="btn" onclick="game.examTournamentFight()">¡Entrar al Torneo!</button>
                <br><br><button class="btn btn-secondary btn-small" onclick="game.abandonExam()">Abandonar</button>
            </div>
        `);
    },

    examTournamentFight() {
        // Recuperar parcialmente antes del torneo
        this.player.hp     = Math.max(this.player.hp,     Math.floor(this.player.maxHp     * 0.60));
        this.player.chakra = Math.max(this.player.chakra, Math.floor(this.player.maxChakra * 0.60));

        const tpl   = (this.examEnemies?.chunin_tournament || [])[0] || { name:'Rival Élite', hp:200, chakra:120, attack:28, defense:18, accuracy:14 };
        const enemy = { ...tpl, maxHp: tpl.hp, maxChakra: tpl.chakra, controlledTurns: 0 };

        this.currentMission = {
            name: 'Torneo Final Chunin', rank: 'A', description: 'Fase 3 del examen.',
            enemies: [], ryo: 0, exp: 0, turns: 0,
            isExamFight: true,
            examMeta: { phase: 'tournament', examType: 'chunin' },
        };
        this.currentEnemy = enemy;
        this.enemyQueue   = [];
        this.totalWaves   = 1;
        this.currentWave  = 1;
        this.startCombat();
    },

    renderExamTournamentResult() {
        const st   = this.player.examState;
        const won  = st.data.tournamentWon;
        this.renderExamScreen(`
            <div class="story-text">
                <p style="color:${won ? '#2ecc71' : '#e74c3c'}; font-weight:bold;">${won ? '🏆 ¡VICTORIA en el Torneo!' : '⚔️ Derrota en el Torneo'}</p>
                <p style="margin-top:10px;">${won
                    ? 'Has demostrado un desempeño excepcional.'
                    : 'Luchaste con valentía. El comité evaluará tu actuación general.'}</p>
            </div>
            <div style="text-align:center; margin-top:14px;">
                <button class="btn" onclick="game.examFinalDecision()">Ver decisión del Comité</button>
            </div>
        `);
    },

    examFinalDecision() {
        const st    = this.player.examState;
        const won   = st.data.tournamentWon;
        const roll  = Math.random();
        const pass  = won ? roll < 0.90 : roll < 0.45;

        st.phase = 'final_decision';
        st.data.finalPass = pass;
        this.saveGame();
        this.renderExamFinalDecision();
    },

    renderExamFinalDecision() {
        const st   = this.player.examState;
        const pass = st.data.finalPass;
        this.renderExamScreen(`
            <div class="story-text">
                <p style="color:var(--gold); font-weight:bold;">DECISIÓN DEL COMITÉ</p>
                <p style="margin-top:10px; font-size:1.2em; color:${pass ? '#2ecc71' : '#e74c3c'}; font-weight:bold;">
                    ${pass ? '🎖️ ¡APROBADO! Eres promovido a Chunin.' : '❌ No promovido en esta ocasión.'}
                </p>
                <p style="margin-top:8px;">${pass
                    ? 'Tu desempeño en las tres fases fue sobresaliente.'
                    : 'Sigue entrenando. Podrás intentarlo de nuevo en 180 días.'}</p>
            </div>
            <div style="text-align:center; margin-top:14px;">
                <button class="btn" onclick="${pass ? "game.examPass('chunin')" : "game.examFail('result')"}">
                    ${pass ? '¡Celebrar mi ascenso!' : 'Aceptar y seguir entrenando'}
                </button>
            </div>
        `);
    },

    // ════════════════════════════════════════════════════════
    //  EXAMEN JONIN
    // ════════════════════════════════════════════════════════

    startJoninExam() {
        if (!this.player?.examState) this.player.examState = { active: true, type: 'jonin', phase: 'intro', data: {} };
        this.renderJoninExam();
    },

    renderJoninExam() {
        const phase = this.player.examState?.phase;

        if (phase === 'intro') return this.renderExamScreen(`
            <div class="story-text">
                <p>Te presentas ante el panel de Jonin. El silencio es total.</p>
                <p style="margin-top:10px;">El Examen Jonin consta de <b>3 pruebas</b>: combate múltiple, misión de infiltración y protección de aliados.</p>
            </div>
            <div style="text-align:center; margin-top:14px;">
                <button class="btn" onclick="game.joninExamStartPhase1()">Iniciar Prueba 1</button>
                <br><br><button class="btn btn-secondary btn-small" onclick="game.abandonExam()">Abandonar</button>
            </div>
        `);

        if (phase === 'test1') return this.renderJoninTest1();
        if (phase === 'test1_between') return this.renderJoninTest1Between();
        if (phase === 'test2') return this.renderJoninTest2();
        if (phase === 'test3_intro') return this.renderJoninTest3Intro();
        if (phase === 'test3') return this.renderJoninTest3();
        if (phase === 'final') return this.renderJoninFinal();
    },

    // ── Jonin Prueba 1: 5 combates ───────────────────────────

    joninExamStartPhase1() {
        const st   = this.player.examState;
        st.phase   = 'test1';
        st.data.joninFightIndex = 0;
        this.saveGame();
        this.renderJoninTest1();
    },

    renderJoninTest1() {
        const st  = this.player.examState;
        const idx = st.data.joninFightIndex || 0;
        this.renderExamScreen(`
            <div class="story-text">
                <p style="color:var(--gold); font-weight:bold;">PRUEBA 1: COMBATE MÚLTIPLE (${idx + 1}/5)</p>
                <p style="margin-top:10px;">5 combates seguidos contra rivales de alto rango.</p>
                <p style="margin-top:6px;">HP: ${Math.floor(this.player.hp)}/${this.player.maxHp} | Chakra: ${Math.floor(this.player.chakra)}/${this.player.maxChakra}</p>
            </div>
            <div style="text-align:center; margin-top:14px;">
                <button class="btn" onclick="game.joninTest1Fight()">Combatir</button>
                <br><br><button class="btn btn-secondary btn-small" onclick="game.abandonExam()">Abandonar</button>
            </div>
        `);
    },

    renderJoninTest1Between() {
        const st  = this.player.examState;
        const idx = st.data.joninFightIndex || 0;
        this.renderExamScreen(`
            <div class="story-text">
                <p style="color:#2ecc71; font-weight:bold;">✅ Combate ${idx} superado</p>
                <p style="margin-top:10px;">HP: ${Math.floor(this.player.hp)}/${this.player.maxHp} | Chakra: ${Math.floor(this.player.chakra)}/${this.player.maxChakra}</p>
                <p style="margin-top:8px;">Usa un item si lo necesitas.</p>
            </div>
            <div style="margin-top:14px;">
                ${this.player.inventory.length > 0
                    ? this.player.inventory.map((item, i) => `
                        <button class="btn btn-small" style="margin:4px; text-align:left;" onclick="game.examForestUseItem(${i}); game.renderJoninExam();">
                            Usar ${item.name}
                        </button>`).join('')
                    : '<p style="opacity:0.75;">Sin items.</p>'}
            </div>
            <div style="text-align:center; margin-top:14px;">
                <button class="btn" onclick="game.renderJoninTest1()">Continuar (Combate ${idx + 1})</button>
            </div>
        `);
    },

    joninTest1Fight() {
        const st  = this.player.examState;
        const idx = st.data.joninFightIndex || 0;
        if (idx >= 5) { st.phase = 'test2'; this.saveGame(); this.renderJoninExam(); return; }

        const tpls = this.examEnemies?.jonin_test1 || [];
        const tpl  = tpls[idx % tpls.length] || { name:'Jonin Rival', hp:280, chakra:140, attack:38, defense:24, accuracy:18 };
        const scale = 1 + idx * 0.15;
        const enemy = {
            name:     tpl.name,
            hp:       Math.floor(tpl.hp * scale),
            chakra:   tpl.chakra,
            attack:   Math.floor(tpl.attack  * scale),
            defense:  Math.floor(tpl.defense * scale),
            accuracy: tpl.accuracy,
            genjutsu: tpl.genjutsu || 12,
            maxHp:    Math.floor(tpl.hp * scale),
            maxChakra: tpl.chakra,
            controlledTurns: 0,
        };
        this.currentMission = {
            name: `Examen Jonin — Prueba 1 (${idx + 1}/5)`, rank: 'S',
            description: 'Combate de alta intensidad.',
            enemies: [], ryo: 0, exp: 0, turns: 0,
            isExamFight: true,
            examMeta: { phase: 'test1', examType: 'jonin', combatIndex: idx },
        };
        this.currentEnemy = enemy;
        this.enemyQueue   = [];
        this.totalWaves   = 1;
        this.currentWave  = 1;
        this.startCombat();
    },

    // ── Jonin Prueba 2: Infiltración ─────────────────────────

    renderJoninTest2() {
        this.renderExamScreen(`
            <div class="story-text">
                <p style="color:var(--gold); font-weight:bold;">PRUEBA 2: MISIÓN DE INFILTRACIÓN</p>
                <p style="margin-top:10px;">Debes obtener información de un objetivo sin ser detectado.</p>
                <p style="margin-top:8px;">Tu habilidad de Genjutsu determinará el resultado.</p>
                <p style="margin-top:8px; opacity:0.85;">Genjutsu actual: <b>${this.player.genjutsu}</b></p>
            </div>
            <div style="text-align:center; margin-top:14px;">
                <button class="btn" onclick="game.joninTest2Attempt()">Iniciar infiltración</button>
                <br><br><button class="btn btn-secondary btn-small" onclick="game.abandonExam()">Abandonar</button>
            </div>
        `);
    },

    joninTest2Attempt() {
        const st      = this.player.examState;
        const roll    = this.rollDice(20) + this.player.genjutsu;
        const needed  = 35;
        const passed  = roll >= needed;
        st.data.test2Passed = passed;
        this.saveGame();

        this.renderExamScreen(`
            <div class="story-text">
                <p style="color:${passed ? '#2ecc71' : '#e74c3c'}; font-weight:bold;">${passed ? '✅ INFILTRACIÓN EXITOSA' : '❌ INFILTRACIÓN FALLIDA'}</p>
                <p style="margin-top:10px;">Tirada: ${roll} (necesitabas ${needed}).</p>
                <p style="margin-top:8px;">${passed
                    ? 'Obtuviste la información sin levantar sospechas.'
                    : 'Fuiste detectado. El examinador anotó el fallo, pero puedes continuar.'}</p>
            </div>
            <div style="text-align:center; margin-top:14px;">
                <button class="btn" onclick="game.joninStartTest3()">Continuar a Prueba 3</button>
            </div>
        `);
    },

    // ── Jonin Prueba 3: Proteger aliados ─────────────────────

    joninStartTest3() {
        const st = this.player.examState;
        st.phase = 'test3_intro';
        st.data.allies = [
            { name: 'Compañero A', hp: 80,  maxHp: 80  },
            { name: 'Compañero B', hp: 60,  maxHp: 60  },
            { name: 'Compañero C', hp: 100, maxHp: 100 },
        ];
        this.saveGame();
        this.renderJoninExam();
    },

    renderJoninTest3Intro() {
        this.renderExamScreen(`
            <div class="story-text">
                <p style="color:var(--gold); font-weight:bold;">PRUEBA 3: PROTECCIÓN DE ALIADOS</p>
                <p style="margin-top:10px;">Debes proteger a 3 compañeros mientras combates. Si alguno cae, fallas.</p>
                <p style="margin-top:8px;">El enemigo puede atacar a tus aliados al azar.</p>
            </div>
            <div style="text-align:center; margin-top:14px;">
                <button class="btn" onclick="game.joninTest3Fight()">Iniciar Combate Final</button>
                <br><br><button class="btn btn-secondary btn-small" onclick="game.abandonExam()">Abandonar</button>
            </div>
        `);
    },

    renderJoninTest3() {
        const st     = this.player.examState;
        const allies = st.data.allies || [];
        this.renderExamScreen(`
            <div class="story-text">
                <p style="color:var(--gold); font-weight:bold;">PRUEBA 3: COMBATE EN CURSO</p>
                <p style="margin-top:8px;">Estado de aliados:</p>
                ${allies.map(a => `<p style="margin-top:4px;">${a.name}: <b>${a.hp}/${a.maxHp} HP</b></p>`).join('')}
            </div>
            <div style="text-align:center; margin-top:14px;">
                <button class="btn" onclick="game.joninTest3Fight()">Continuar combate</button>
            </div>
        `);
    },

    joninTest3Fight() {
        const st    = this.player.examState;
        const tpls  = this.examEnemies?.jonin_test3 || [];
        const tpl   = tpls[0] || { name:'ANBU de Élite', hp:350, chakra:180, attack:45, defense:30, accuracy:22 };
        const enemy = { ...tpl, maxHp: tpl.hp, maxChakra: tpl.chakra, controlledTurns: 0 };

        this.currentMission = {
            name: 'Examen Jonin — Prueba 3', rank: 'U',
            description: 'Protege a tus aliados durante el combate.',
            enemies: [], ryo: 0, exp: 0, turns: 0,
            isExamFight: true,
            examMeta: { phase: 'test3', examType: 'jonin', protectAllies: true, allies: st.data.allies },
        };
        this.currentEnemy = enemy;
        this.enemyQueue   = [];
        this.totalWaves   = 1;
        this.currentWave  = 1;
        this.startCombat();
    },

    renderJoninFinal() {
        const st       = this.player.examState;
        const t1Passed = st.data.test1Passed;
        const t2Passed = st.data.test2Passed;
        const t3Passed = st.data.test3Passed;
        const count    = [t1Passed, t2Passed, t3Passed].filter(Boolean).length;
        const pass     = count >= 2;

        this.renderExamScreen(`
            <div class="story-text">
                <p style="color:var(--gold); font-weight:bold;">RESULTADO FINAL DEL EXAMEN JONIN</p>
                <p style="margin-top:10px;">Prueba 1 (Combate): <b style="color:${t1Passed ? '#2ecc71' : '#e74c3c'}">${t1Passed ? '✅ Superada' : '❌ Fallada'}</b></p>
                <p style="margin-top:6px;">Prueba 2 (Infiltración): <b style="color:${t2Passed ? '#2ecc71' : '#e74c3c'}">${t2Passed ? '✅ Superada' : '❌ Fallada'}</b></p>
                <p style="margin-top:6px;">Prueba 3 (Protección): <b style="color:${t3Passed ? '#2ecc71' : '#e74c3c'}">${t3Passed ? '✅ Superada' : '❌ Fallada'}</b></p>
                <p style="margin-top:14px; font-size:1.1em; color:${pass ? '#2ecc71' : '#e74c3c'}; font-weight:bold;">
                    ${pass ? '🔥 ¡APROBADO! Ahora eres Jonin.' : '❌ No aprobado en esta ocasión.'}
                </p>
            </div>
            <div style="text-align:center; margin-top:14px;">
                <button class="btn" onclick="${pass ? "game.examPass('jonin')" : "game.examFail('result')"}">
                    ${pass ? '¡Aceptar rango Jonin!' : 'Salir y seguir entrenando'}
                </button>
            </div>
        `);
    },

    // ── Handlers de victoria/derrota en combate de examen ─────

    handleExamFightVictory() {
        const st   = this.player.examState;
        if (!st?.active) return;
        const meta = this.currentMission?.examMeta || {};

        if (meta.examType === 'chunin') {
            if (meta.phase === 'forest') {
                const idx = st.data.forestIndex || 0;
                st.data.forestIndex = idx + 1;
                if (st.data.forestIndex >= 3) {
                    st.phase = 'tournament_intro';
                    this.saveGame();
                    this.showScreen('village-screen');
                    setTimeout(() => { this.showScreen('exam-screen'); this.renderChuninExam(); }, 500);
                } else {
                    st.phase = 'forest_between';
                    this.saveGame();
                    this.showScreen('village-screen');
                    setTimeout(() => { this.showScreen('exam-screen'); this.renderChuninExam(); }, 500);
                }
            } else if (meta.phase === 'tournament') {
                st.data.tournamentWon = true;
                st.phase = 'tournament_result';
                this.saveGame();
                this.showScreen('village-screen');
                setTimeout(() => { this.showScreen('exam-screen'); this.renderChuninExam(); }, 500);
            }
        } else if (meta.examType === 'jonin') {
            if (meta.phase === 'test1') {
                const idx = (st.data.joninFightIndex || 0) + 1;
                st.data.joninFightIndex = idx;
                if (idx >= 5) {
                    st.data.test1Passed = true;
                    st.phase = 'test2';
                    this.saveGame();
                    this.showScreen('village-screen');
                    setTimeout(() => { this.showScreen('exam-screen'); this.renderJoninExam(); }, 500);
                } else {
                    st.phase = 'test1_between';
                    this.saveGame();
                    this.showScreen('village-screen');
                    setTimeout(() => { this.showScreen('exam-screen'); this.renderJoninExam(); }, 500);
                }
            } else if (meta.phase === 'test3') {
                st.data.test3Passed = true;
                st.phase = 'final';
                this.saveGame();
                this.showScreen('village-screen');
                setTimeout(() => { this.showScreen('exam-screen'); this.renderJoninExam(); }, 500);
            }
        }
    },

    handleExamFightDefeat() {
        const st   = this.player.examState;
        if (!st?.active) return;
        const meta = this.currentMission?.examMeta || {};

        if (meta.examType === 'chunin' && meta.phase === 'forest') {
            this.showScreen('village-screen');
            setTimeout(() => this.examFail('combat'), 300);
            return;
        }
        if (meta.examType === 'chunin' && meta.phase === 'tournament') {
            st.data.tournamentWon = false;
            st.phase = 'tournament_result';
            this.saveGame();
            this.showScreen('village-screen');
            setTimeout(() => { this.showScreen('exam-screen'); this.renderChuninExam(); }, 500);
            return;
        }
        if (meta.examType === 'jonin' && meta.phase === 'test1') {
            st.data.test1Passed = false;
            st.data.joninFightIndex = 5;
            st.phase = 'test2';
            this.saveGame();
            this.showScreen('village-screen');
            setTimeout(() => { this.showScreen('exam-screen'); this.renderJoninExam(); }, 500);
            return;
        }
        if (meta.examType === 'jonin' && meta.phase === 'test3') {
            st.data.test3Passed = false;
            st.phase = 'final';
            this.saveGame();
            this.showScreen('village-screen');
            setTimeout(() => { this.showScreen('exam-screen'); this.renderJoninExam(); }, 500);
            return;
        }
        // Fallback
        this.examFail('combat');
    },

};
