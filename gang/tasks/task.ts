import { NS } from "@ns";
import { NSContainer } from "/lib/ns_container";

export abstract class Task extends NSContainer {
    name: string;
    constructor(ns: NS, name: string) {
        super(ns);
        this.validateTaskName(name)
        
        this.name = name;
    }

    getTaskStats() {
        return this.ns.gang.getTaskStats(this.name)
    }

    private getValidTasks(): Array<string> {
        return [
            "Unassigned",
            "Mug People",
            "Deal Drugs",
            "Strongarm Civilians",
            "Run a Con",
            "Armed Robbery",
            "Traffick Illegal Arms",
            "Threaten & Blackmail",
            "Human Trafficking",
            "Terrorism",
            "Vigilante Justice",
            "Train Combat",
            "Train Hacking",
            "Train Charisma",
            "Territory Warfare"
        ]
    }

    private validateTaskName(name: string): void {
        if (this.getValidTasks().includes(name)) {
            return;
        }
        throw Error(`Invalid task name - ${name}\nValid tasks are - ${this.getValidTasks().join(' | ')}`)
    }
}