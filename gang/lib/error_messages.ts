import { Task } from "gang/tasks/task"
import { Member } from "gang/member/member"
import { Stats } from "gang/stats/enum_stats"

// Gang-related
export const failRecruit = () => "Failed to recruit member"
export const memberNotfound = (member: Member, members: Array<Member>) =>
                                `Member with name ${member} not found. Available members are: ${members.join(' | ')}`

// Member-related
export const statNotFound = (stat: Stats, member: Member) => `Stat: ${stat} not found for member: ${member}`

// Task-related
export const nullTask = () => "No tasks found"
export const invalidTask = (task: Task, validTasks: Array<Task>) => `Invalid task - ${task}. Valid tasks are: ${validTasks.join(' | ')}`

// Ascension-related
export const ineligibleAscension = (member: Member) => `${member} isn't eligible for ascension`

// Miscellaneous
export const unreachableConditionalPathReached = () => 'Conditional evaluated to invalid path'
