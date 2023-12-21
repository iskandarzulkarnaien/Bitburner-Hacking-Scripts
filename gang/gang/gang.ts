import { NS } from "@ns";
import { NSContainer } from "/lib/ns_container";
import { Member } from "gang/member/member";
import { Task } from "/gang/tasks/task";
import { calculateApproximateMoneyGain } from "/gang/lib/helpers"
import { memberNotfound, nullTask } from "gang/lib/error_messages";
import { Warrior } from "gang/member/warrior";


export class Gang extends NSContainer {
    // NS-related
    gang: NS["gang"]

    // Gang-related
    members: Array<Member>

    respectLostAscensionThreshold = 0.5  // Respect lost from ascension will never be more than this factor of total respect

    constructor(ns: NS) {
        super(ns);
        this.gang = ns.gang
        this.members = Array<Member>();
    }

    init(): Gang {
        const names = this.ns.gang.getMemberNames();
        // TODO: Read roles
        // const savedNames = new Map<string, string>()
        for (const name of names) {
            const role = this.chooseRole()
            // let role = this.chooseRole()
            // if (savedNames.has(name)) {
            //     role = savedNames.get(name)
            // }
            this.initiateMember(name, role);
        }
        return this;
    }

    // Info-related
    getInfo() {
        return this.gang.getGangInformation()
    }

    // Member-related
    initiateMember<MemberRole extends Member>(name: string, Role: new (ns: NS, name: string) => MemberRole): void {
        const member = new Role(this.ns, name)
        this.members.push(member)
    }

    recruitMember(): boolean {
        const currNumMembers = this.gang.getMemberNames().length
        
        const name = `Member-${currNumMembers}`
        const success = this.gang.recruitMember(name)
        
        if (success) {
            this.initiateMember(name, this.chooseRole())
            this.ns.print(`Successfully recruited ${name}`)
        }
        return success
    }

    chooseRole(): new (ns: NS, name: string) => Member {
        return Warrior // Placeholder
    }

    switchRole<MemberRole extends Member>(member: Member, Role: new (ns: NS, name: string) => MemberRole): void {
        const memberIndex = this.members.findIndex((currMember) => currMember.equals(member))
        if (memberIndex === -1) throw new Error(memberNotfound(member, this.members))

        this.members[memberIndex] = member.roleSwap(Role)
    }

    // Task-related
    taskMember(member: Member, task: Task): void {
        member.performTask(task);
    }

    taskAllMembers(task: Task): void {
        for (const member of this.members) {
            this.taskMember(member, task);
        }
    }

    taskMemberBestTask(member: Member): void {
        if (member.requireTraining()) {
            member.train()
            return
        }
        const task = this.getHighestIncomeTask(member);
        this.taskMember(member, task);
    }

    taskAllMembersBestTask(): void {
        for (const member of this.members) {
            this.taskMemberBestTask(member);
        }
    }

    // Ascension-related
    ascendMember(member: Member): void {
        // TODO: Factor in respect lost during ascension. May need to balance ascensions and recruitment.
        if (!member.ascensionEligible()) {
            return
        }
        this.ns.print(`Successfully ascended member: ${member}`)
        member.performAscension()
    }

    ascendGang(): void {
        for (const member of this.members) {
            this.ascendMember(member)
        }
    }

    // Upgrade related
    upgradeGang(): void {
        return
    }

    // Helpers
    getHighestIncomeTask(member: Member): Task {
        let highestIncomeValue = 0.0; 
        let highestIncomeTask: Task | undefined;
        for (const task of member.validTasks) {
            const taskIncomeValue = calculateApproximateMoneyGain(this.ns, this, member, task)
            if (taskIncomeValue < highestIncomeValue) {
                continue;
            }
            highestIncomeTask = task;
            highestIncomeValue = taskIncomeValue;
        }
        if (highestIncomeTask === undefined) throw new Error(nullTask());
        return highestIncomeTask
    }

    private getAscensionRespectEligibility(member: Member): boolean {
        const gangRespect = this.getInfo().respect
        const memberRespect = member.getMemberInfo().earnedRespect
        return  memberRespect / gangRespect < this.respectLostAscensionThreshold
    }
}