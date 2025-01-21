import { Message } from "./Database";

export class Queue {
    private messages: Message[];
    private inProcessMessages: Map<string, number>;
    private dequeueIndex: number;

    constructor() {
        this.messages = [];
        this.inProcessMessages = new Map(); // save the relation between worker id to message. in addition, using map structure is effeicent. prevents working on the same message
        this.dequeueIndex = 0;
    }

    Enqueue = (message: Message) => {
        this.messages.push(message);
    }

    // originally the code worked with splice which is inefficient because splice changes the original array and which leads us to 
    // re-copy the array. using dequeue index helps us prevent this infficency.
    Dequeue = (workerId: number): Message | undefined => {
        while (this.dequeueIndex < this.messages.length) { // checking for the first meesage which isn't in process (new)
            const message = this.messages[this.dequeueIndex];
            if (!this.inProcessMessages.has(message.id)) { 
                this.inProcessMessages.set(message.id, workerId);
                this.dequeueIndex++;
                return message;
            }
            this.dequeueIndex++;
        }
        return undefined;
    }

    // each message in inProcessMessages is saved with worker id so we can compare and delete it from the in process messages map 
    Confirm = (workerId: number, messageId: string) => {
        const currentWorkerId = this.inProcessMessages.get(messageId);
        if (currentWorkerId === workerId) {
            this.inProcessMessages.delete(messageId);
        }
    }

    // originally size related to all messages but ignored the messages that already dequeued.
    Size = () => {
        return this.messages.length - this.dequeueIndex;
    }
}