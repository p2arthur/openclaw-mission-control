"""Add template_set column to agents table

Revision ID: add_template_set_to_agents
Revises: add_template_set_to_boards
Create Date: 2026-03-24 00:00:00.000000

"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_template_set_to_agents'
down_revision = 'add_template_set_to_boards'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('agents', sa.Column('template_set', sa.String(), nullable=True))
    op.create_index('ix_agents_template_set', 'agents', ['template_set'])


def downgrade() -> None:
    op.drop_index('ix_agents_template_set', table_name='agents')
    op.drop_column('agents', 'template_set')
