import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Main")
export class Main extends Component {
    private fsm3 = new FSM3();
    hp = 100;
    start() {

        this.fsm3.regState(1, new LogState("状态1"));
        this.fsm3.regState(2, new LogState("状态2"));
        this.fsm3.regState(3, new LogState("状态3"));

        this.fsm3.regTran(1,2,()=> this.hp <= 30)
        this.fsm3.changeState(1);
        this.fsm3.regTran(-1,3,()=> this.hp <= 10)
        
        // let fsm = new FSM3();
        // fsm.regState(1, new LogState("状态1"));
        // fsm.regState(2, new LogState("状态2"));
        // fsm.regState(3, new LogState("状态3"));
        // fsm.changeState(1);
        // setTimeout(() => {
        //     fsm.changeState(2);
        // }, 1000);
        // let fsm = new FSM2();
        // fsm.regState(1, () => console.log("状态1"));
        // fsm.regState(2, () => console.log("状态2"));
        // fsm.regState(3, () => console.log("状态3"));
        // fsm.changState(2);
        // let fsm = new FSM1();
        // fsm.changState(1);
    }

    update(deltaTime: number) {
        this.hp --;
        if(this.fsm3) this.fsm3.update(deltaTime)
        
    }
}

export interface IState {
    onEnter();
    onExit();
    onUpdate(dt: number);
}

export class LogState implements IState {
    log: string;
    constructor(log: string) {
        this.log = log;
    }
    onEnter() {
        if (this.log) {
            console.log("进入状态", this.log);
        }
    }
    onExit() {
        if (this.log) {
            console.log("离开状态", this.log);
        }
    }
    onUpdate(dt: number) {}
}

export interface ITrans {
    form: number;
    to: number;
    check: () => boolean;
}

export class FSM3 {
    private states: { [key: number]: IState } = {};
    private curId: number = -1;
    private trans: ITrans[] = [];

    regTran(form: number, to: number, checkFunc: () => boolean) {
        this.trans.push({ form: form, to: to, check: checkFunc });
    }

    regState(id: number, state: IState) {
        this.states[id] = state;
    }

    update(dt) {
        if (this.curId != -1) {
            let st = this.states[this.curId];
            st.onUpdate(dt);
        }

        for (let index = 0; index < this.trans.length; index++) {
            const tran = this.trans[index];
            if (tran.check()) {
                if (tran.form == -1) {
                    this.changeState(tran.to);
                    break;
                }
                if (tran.form == this.curId) {
                    this.changeState(tran.to);
                }
            }
        }
    }

    changeState(id: number) {
        if(this.curId != id) {
            if (this.curId != -1) {
                this.states[this.curId].onExit();
            }
            this.states[id].onEnter();
            this.curId = id;
        }
     
    }
}

// export class FSM3 {
//     private states: { [key: number]: IState } = {};
//     private curId: number = -1;
//     regState(id: number, state: IState) {
//         this.states[id] = state;
//     }

//     update(dt) {
//         if (this.curId != -1) {
//             let st = this.states[this.curId];
//             st.onUpdate(dt);
//         }
//     }

//     changeState(id: number) {
//         if (this.curId != -1) {
//             this.states[this.curId].onExit();
//         }
//         this.states[id].onEnter();
//         this.curId = id;
//     }
// }

class FSM2 {
    funcs: { [key: number]: () => void } = {};
    regState(state: number, func: () => void) {
        this.funcs[state] = func;
    }
    changState(state) {
        if (this.funcs[state]) {
            this.funcs[state]();
        }
    }
}

class FSM1 {
    changState(state) {
        if (state == 1) console.log("状态1");
        else if (state == 2) console.log("状态2");
        else if (state == 3) console.log("状态3");
    }
}
