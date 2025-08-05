// import {
//   ContainerModule,
//   ContainerModuleLoadOptions,
//   Newable,
// } from "inversify";

// interface ServiceBinding {
//   interface: symbol;
//   implementation: Newable<any>;
//   scope?: "singleton" | "transient" | "request";
// }

// export class ContainerModuleBuilder {
//   private bindings: ServiceBinding[] = [];
//   addSingleton<T>(serviceInterface: symbol, implementation: Newable<T>) {
//     this.bindings.push({
//       interface: serviceInterface,
//       implementation,
//       scope: "singleton",
//     });
//     return this;
//   }

//   addTransient<T>(serviceInterface: symbol, implementation: Newable<T>) {
//     this.bindings.push({
//       interface: serviceInterface,
//       implementation,
//       scope: "transient",
//     });
//     return this;
//   }

//   addRequest<T>(serviceInterface: symbol, implementation: Newable<T>) {
//     this.bindings.push({
//       interface: serviceInterface,
//       implementation,
//       scope: "request",
//     });
//     return this;
//   }
//   private bindServices(
//     moduleOptions: ContainerModuleLoadOptions,
//     bindings: ServiceBinding[],
//     defaultScope: "singleton" | "transient" | "request" = "singleton"
//   ) {
//     bindings.forEach(
//       ({
//         interface: serviceInterface,
//         implementation,
//         scope = defaultScope,
//       }) => {
//         const binding = moduleOptions.bind(serviceInterface).to(implementation);

//         switch (scope) {
//           case "singleton":
//             binding.inSingletonScope();
//             break;
//           case "transient":
//             binding.inTransientScope();
//             break;
//           case "request":
//             binding.inRequestScope();
//             break;
//         }
//       }
//     );
//   }

//   build(): ContainerModule {
//     return new ContainerModule((bind: ContainerModuleLoadOptions) => {
//       this.bindServices(bind, this.bindings);
//     });
//   }
// }
import {
  ContainerModule,
  ContainerModuleLoadOptions,
  Newable,
} from "inversify";

/**
 * @typedef {Object} ServiceBinding
 * @description Defines a service binding configuration for Inversify dependency injection.
 * @property {symbol} interface - The symbol representing the service interface.
 * @property {Newable<any>} implementation - The class implementation for the service.
 * @property {"singleton" | "transient" | "request"} [scope] - The scope of the service binding (optional, defaults to undefined).
 */
interface ServiceBinding {
  interface: symbol;
  implementation: Newable<any>;
  scope?: "singleton" | "transient" | "request";
}

/**
 * @typedef {Object} ServiceBinding
 * @property {symbol} interface - The symbol representing the service interface.
 * @property {Newable<any>} implementation - The class implementation for the service.
 * @property {"singleton" | "transient" | "request"} [scope] - The scope of the service binding (optional).
 */

/**
 * A builder class for creating Inversify ContainerModule instances with service bindings.
 * Allows adding services with different scopes (singleton, transient, request) and building a module.
 */
export class ContainerModuleBuilder {
  /**
   * @private
   * @type {ServiceBinding[]}
   * @description Array to store service bindings.
   */
  private bindings: ServiceBinding[] = [];

  /**
   * Adds a singleton-scoped service binding.
   * @template T - The type of the service implementation.
   * @param {symbol} serviceInterface - The symbol representing the service interface.
   * @param {Newable<T>} implementation - The class implementation for the service.
   * @returns {ContainerModuleBuilder} The current instance for method chaining.
   */
  addSingleton<T>(serviceInterface: symbol, implementation: Newable<T>) {
    this.bindings.push({
      interface: serviceInterface,
      implementation,
      scope: "singleton",
    });
    return this;
  }

  /**
   * Adds a transient-scoped service binding.
   * @template T - The type of the service implementation.
   * @param {symbol} serviceInterface - The symbol representing the service interface.
   * @param {Newable<T>} implementation - The class implementation for the service.
   * @returns {ContainerModuleBuilder} The current instance for method chaining.
   */
  addTransient<T>(serviceInterface: symbol, implementation: Newable<T>) {
    this.bindings.push({
      interface: serviceInterface,
      implementation,
      scope: "transient",
    });
    return this;
  }

  /**
   * Adds a request-scoped service binding.
   * @template T - The type of the service implementation.
   * @param {symbol} serviceInterface - The symbol representing the service interface.
   * @param {Newable<T>} implementation - The class implementation for the service.
   * @returns {ContainerModuleBuilder} The current instance for method chaining.
   */
  addRequest<T>(serviceInterface: symbol, implementation: Newable<T>) {
    this.bindings.push({
      interface: serviceInterface,
      implementation,
      scope: "request",
    });
    return this;
  }

  /**
   * Binds services to the container module with the specified scope.
   * @private
   * @param {ContainerModuleLoadOptions} moduleOptions - The binding options provided by Inversify.
   * @param {ServiceBinding[]} bindings - The array of service bindings to process.
   * @param {"singleton" | "transient" | "request"} [defaultScope="singleton"] - The default scope if not specified in the binding.
   */
  private bindServices(
    moduleOptions: ContainerModuleLoadOptions,
    bindings: ServiceBinding[],
    defaultScope: "singleton" | "transient" | "request" = "singleton"
  ) {
    bindings.forEach(
      ({
        interface: serviceInterface,
        implementation,
        scope = defaultScope,
      }) => {
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

  /**
   * Builds and returns a new ContainerModule with the configured service bindings.
   * @returns {ContainerModule} The constructed Inversify ContainerModule.
   */
  build(): ContainerModule {
    return new ContainerModule((bind: ContainerModuleLoadOptions) => {
      this.bindServices(bind, this.bindings);
    });
  }
}
