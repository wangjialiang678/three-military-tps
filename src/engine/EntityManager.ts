/** EntityManager (port of three-fps EntityManager.js). */
import type Entity from './Entity';

export default class EntityManager {
  private ids = 0;
  public entities: Entity[] = [];

  Get(name: string): Entity | undefined {
    return this.entities.find((el) => el.Name === name);
  }

  Add(entity: Entity): void {
    if (!entity.Name) entity.SetName(this.ids);
    entity.id = this.ids;
    this.ids++;
    entity.SetParent(this);
    this.entities.push(entity);
  }

  /** Call Initialize on every component once all entities are added. */
  EndSetup(): void {
    for (const ent of this.entities) {
      for (const key in ent.components) ent.components[key].Initialize();
    }
  }

  PhysicsUpdate(world: any, timeStep: number): void {
    for (const entity of this.entities) entity.PhysicsUpdate(world, timeStep);
  }

  Update(timeElapsed: number): void {
    for (const entity of this.entities) entity.Update(timeElapsed);
  }
}
