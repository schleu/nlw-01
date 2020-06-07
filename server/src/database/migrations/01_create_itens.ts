import Knex from 'knex';

export async function up(knex: Knex){
    // CRIAR A TABELA

    return knex.schema.createTable('itens', table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('name').notNullable();

    })
}

export async function down(knex: Knex){
    // VOLTAR ATRAS (DELETAR A TABELA)

    return knex.schema.dropTable('itens');
}