"""Initial migration

Revision ID: 415106206287
Revises: 
Create Date: 2025-03-23 01:34:59.980617

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '415106206287'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_favorites_id', table_name='favorites')
    op.drop_table('favorites')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('favorites',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('event_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['event_id'], ['events.id'], name='favorites_event_id_fkey'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='favorites_user_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='favorites_pkey')
    )
    op.create_index('ix_favorites_id', 'favorites', ['id'], unique=False)
    # ### end Alembic commands ###
