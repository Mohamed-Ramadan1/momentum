import {
  ContainerModule,
  ContainerModuleLoadOptions,
  Newable,
} from "inversify";

interface ServiceBinding {
  interface: symbol;
  implementation: Newable<any>;
  scope?: "singleton" | "transient" | "request";
}

export class ContainerModuleBuilder {
  private bindings: ServiceBinding[] = [];

  addSingleton<T>(serviceInterface: symbol, implementation: Newable<T>) {
    this.bindings.push({
      interface: serviceInterface,
      implementation,
      scope: "singleton",
    });
    return this;
  }

  addTransient<T>(serviceInterface: symbol, implementation: Newable<T>) {
    this.bindings.push({
      interface: serviceInterface,
      implementation,
      scope: "transient",
    });
    return this;
  }

  addRequest<T>(serviceInterface: symbol, implementation: Newable<T>) {
    this.bindings.push({
      interface: serviceInterface,
      implementation,
      scope: "request",
    });
    return this;
  }

  private bindServices(moduleOptions: ContainerModuleLoadOptions): void {
    this.bindings.forEach(
      ({
        interface: serviceInterface,
        implementation,
        scope = "singleton",
      }) => {
        // Use moduleOptions.bind instead of calling moduleOptions directly
        const binding = moduleOptions.bind(serviceInterface).to(implementation);

        switch (scope) {
          case "singleton":
            binding.inSingletonScope();
            break;
          case "transient":
            binding.inTransientScope();
            break;
          case "request":
            binding.inRequestScope();
            break;
        }
      }
    );
  }

  build(): ContainerModule {
    return new ContainerModule((moduleOptions: ContainerModuleLoadOptions) => {
      // Pass the entire moduleOptions object, don't try to call it
      this.bindServices(moduleOptions);
    });
  }
}

// Debug version with logging
export class ContainerModuleBuilderDebug {
  private bindings: ServiceBinding[] = [];

  addSingleton<T>(serviceInterface: symbol, implementation: Newable<T>) {
    console.log(
      `📦 Adding singleton: ${serviceInterface.toString()} -> ${implementation.name}`
    );
    this.bindings.push({
      interface: serviceInterface,
      implementation,
      scope: "singleton",
    });
    return this;
  }

  addTransient<T>(serviceInterface: symbol, implementation: Newable<T>) {
    console.log(
      `📦 Adding transient: ${serviceInterface.toString()} -> ${implementation.name}`
    );
    this.bindings.push({
      interface: serviceInterface,
      implementation,
      scope: "transient",
    });
    return this;
  }

  addRequest<T>(serviceInterface: symbol, implementation: Newable<T>) {
    console.log(
      `📦 Adding request: ${serviceInterface.toString()} -> ${implementation.name}`
    );
    this.bindings.push({
      interface: serviceInterface,
      implementation,
      scope: "request",
    });
    return this;
  }

  private bindServices(moduleOptions: ContainerModuleLoadOptions): void {
    console.log(`🔗 Binding ${this.bindings.length} services...`);

    this.bindings.forEach(
      ({
        interface: serviceInterface,
        implementation,
        scope = "singleton",
      }) => {
        try {
          console.log(
            `   Binding ${serviceInterface.toString()} to ${implementation.name} (${scope})`
          );

          // Correct usage: moduleOptions.bind()
          const binding = moduleOptions
            .bind(serviceInterface)
            .to(implementation);

          switch (scope) {
            case "singleton":
              binding.inSingletonScope();
              break;
            case "transient":
              binding.inTransientScope();
              break;
            case "request":
              binding.inRequestScope();
              break;
          }

          console.log(
            `   ✅ Successfully bound ${serviceInterface.toString()}`
          );
        } catch (error) {
          console.error(
            `   ❌ Failed to bind ${serviceInterface.toString()}:`,
            error
          );
          throw error;
        }
      }
    );

    console.log(`🔗 Completed binding ${this.bindings.length} services`);
  }

  build(): ContainerModule {
    console.log(
      `🏗️  Building ContainerModule with ${this.bindings.length} bindings`
    );

    return new ContainerModule((moduleOptions: ContainerModuleLoadOptions) => {
      console.log("🔗 ContainerModule callback executing...");
      this.bindServices(moduleOptions);
      console.log("🔗 ContainerModule callback completed");
    });
  }
}
