#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/dd0c0fa14cd4c8369684e185e1c58c7f16ee9ef8c5fee2a13ab9ed6cab1ec0da/contract';
import endContract from '../../snapshots/dd0c0fa14cd4c8369684e185e1c58c7f16ee9ef8c5fee2a13ab9ed6cab1ec0da/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'VisitorCount',
        columns: [
          col('count', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
