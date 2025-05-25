import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function checkDB() {
  const db = await open({
    filename: './db.sqlite',
    driver: sqlite3.Database
  });
  
  console.log('=== TABLAS ===');
  const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
  console.log(tables);
  
  console.log('\n=== PARTIDOS ===');
  const matches = await db.all('SELECT * FROM matches');
  console.log(matches);
  
  console.log('\n=== STANDINGS ===');
  const standings = await db.all('SELECT * FROM standings');
  console.log(standings);
  
  await db.close();
}

checkDB().catch(console.error);
