"""Add template_set column to boards table

Revision ID: add_template_set_to_boards
Revises: a9b1c2d3e4f7
Create Date: 2026-03-23 21:55:00.000000

"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_template_set_to_boards'
down_revision = 'a9b1c2d3e4f7'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add template_set column with default value 'default'
    op.add_column('boards', sa.Column('template_set', sa.String(), nullable=False, server_default='default'))
    
    # Create index for faster lookups
    op.create_index('ix_boards_template_set', 'boards', ['template_set'])


def downgrade() -> None:
    # Remove index first
    op.drop_index('ix_boards_template_set', table_name='boards')
    
    # Remove column
    op.drop_column('boards', 'template_set')
