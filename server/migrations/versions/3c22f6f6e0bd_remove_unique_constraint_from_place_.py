"""Remove unique constraint from Place address

Revision ID: 3c22f6f6e0bd
Revises: ff3a9366da02
Create Date: 2025-07-15 18:51:59.619006

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3c22f6f6e0bd'
down_revision = 'ff3a9366da02'
branch_labels = None
depends_on = None


# def upgrade():
#     with op.batch_alter_table('places', recreate='always') as batch_op: 
#         batch_op.drop_constraint('uq_places_address', type_='unique') 
#         batch_op.alter_column('address', existing_type=sa.String(), nullable=False )

def upgrade():
    # Step 2: Create a new table without the UNIQUE constraint on 'address'.
    op.execute("""
    CREATE TABLE places_new (
        id INTEGER PRIMARY KEY,
        name VARCHAR NOT NULL,
        address VARCHAR NOT NULL
    );
    """)

    # Step 3: Copy data from the old table to the new table.
    op.execute("""
    INSERT INTO places_new (id, name, address)
    SELECT id, name, address FROM places;
    """)

    # Step 4: Drop the old table.
    op.execute("DROP TABLE places;")

    # Step 5: Rename the new table to the original name.
    op.execute("ALTER TABLE places_new RENAME TO places;")


# def downgrade():
#     with op.batch_alter_table('places', recreate='always') as batch_op:
#         batch_op.alter_column('address',
#             existing_type=sa.String(),
#             nullable=False,
#             unique=True
#         )

def downgrade():
    # Step 1: Create a new table with the UNIQUE constraint on 'address'.
    op.execute("""
    CREATE TABLE places_old (
        id INTEGER PRIMARY KEY,
        name VARCHAR NOT NULL,
        address VARCHAR NOT NULL UNIQUE
    );
    """)

    # Step 2: Copy data from the current table to the new table.
    op.execute("""
    INSERT INTO places_old (id, name, address)
    SELECT id, name, address FROM places;
    """)

    # Step 3: Drop the current table.
    op.execute("DROP TABLE places;")

    # Step 4: Rename the new table to the original name.
    op.execute("ALTER TABLE places_old RENAME TO places;")