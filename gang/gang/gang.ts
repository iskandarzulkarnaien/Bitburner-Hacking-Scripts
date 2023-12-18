import { NS } from "@ns";
import { Member } from "gang/member/member";
import { NSContainer } from "/lib/ns_container";
import { Task } from "/gang/tasks/task";


export class Gang extends NSContainer {
    gang: NS["gang"]
    members: Array<Member>

    constructor(ns: NS) {
        super(ns);
        this.gang = ns.gang
        this.members = Array<Member>();
    }

    init(): Gang {
        const names = this.ns.gang.getMemberNames();
        for (const name of names) {
            this.createMember(name);
        }
        return this;
    }

    getInfo() {
        return this.gang.getGangInformation()
    }

    addMember(member: Member): void {
        this.members.push(member)
    }

    createMember(name: string): void {
        this.addMember(new Member(this.ns, name));
    }

    recruitMember(): boolean {
        return this.gang.recruitMember('PLACEHOLDER')
    }

    taskMember(member: Member, task: Task): void {
        member.execTask(task);
    }

    taskAllMembers(task: Task): void {
        for (const member of this.members) {
            this.taskMember(member, task);
        }
    }

    execMember(member: Member): void {
        member.execTask(member.bestTask())
    }

    execAllMembers(): void {
        for (const member of this.members) {
            member.execTask(member.bestTask())

        }
    }

    upgradeGang(): void {
        return
    }
}