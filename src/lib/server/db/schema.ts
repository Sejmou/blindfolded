import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const task = sqliteTable('task', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	priority: integer('priority').notNull().default(1)
});

/** Each visitor gets a unique voting link; permutation randomizes which file is "A" vs "B" */
export const sessions = sqliteTable('sessions', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	token: text('token').notNull().unique(),
	/** JSON array of file indices, e.g. [1,0] = slot 0 is file 1, slot 1 is file 0 */
	permutation: text('permutation').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const votes = sqliteTable('votes', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	sessionId: text('session_id')
		.notNull()
		.references(() => sessions.id, { onDelete: 'cascade' }),
	/** Which option they chose (0-based slot index, not file index) */
	chosenSlotIndex: integer('chosen_slot_index').notNull(),
	/** Filename they chose (resolved at vote time so results stay correct if files change) */
	chosenFileName: text('chosen_file_name'),
	voterName: text('voter_name').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});
