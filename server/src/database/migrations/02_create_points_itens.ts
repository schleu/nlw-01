import Knex from 'knex';

export async function up(knex: Knex){
    // CRIAR A TABELA

    return knex.schema.createTable('points_itens', table => {
        table.increments('id').primary();
        table.integer('idPoints')
        .notNullable()
        .references('id')
        .inTable('points');
        
        table.integer('IdItens')
        .notNullable()
        .references('id')
        .inTable('itens');

    })
}

export async function down(knex: Knex){
    // VOLTAR ATRAS (DELETAR A TABELA)
    return knex.schema.dropTable('points_itens');
}