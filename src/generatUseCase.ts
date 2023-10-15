import { camelToSnakeCase } from "./functions";

export const generateUseCase = (path: string, value: ReqestContent, packageName: string) => {
  const useCaseName = path.split("/").pop() || "";

  const useCase = `
    import 'package:${packageName}/core/abstracts/repositories/network_repository.dart';
    import 'package:${packageName}/core/constants/network_method.dart';
    import 'package:${packageName}/core/abstracts/useCases/authenticated_usecase.dart';
    import 'package:${packageName}/core/helpers/int_parser_extension.dart';
    import 'package:${packageName}/infrastructure/authentication/authentication_repository.dart';
    import 'package:injectable/injectable.dart';

    import '${camelToSnakeCase(useCaseName)}_usecase_request.dart';
    import '${camelToSnakeCase(useCaseName)}_usecase_response.dart';

    @injectable
    class Core${useCaseName}UseCase extends CoreAuthenticatedUseCase<
        Core${useCaseName}UseCaseRequest, Core${useCaseName}UseCaseResponse> {
    final CoreNetworkRepository networkRepo;
    final CoreAuthenticationRepository authenticationRepository;

    Core${useCaseName}UseCase({
        required this.networkRepo,
        required this.authenticationRepository,
    });

    @override
    Future<Core${useCaseName}UseCaseResponse> action(
        Core${useCaseName}UseCaseRequest request) async {

        final responseObj = await networkRepo.request(
            path: '${path}',
            method: CoreNetworkMethod.${value.method},
            authToken: await authRepo.userToken,
            responseClass: () => Core${useCaseName}ResponseModel(),
            queryParameters: {
                ${value.queryParamns
                  .map((x) => `${x.name}: request.${x.name},`)
                  .join("\n")}
            },
            bodyParameters: {
                ${value.boadyParamns
                  .map((x) => `${x.name}: request.${x.name},`)
                  .join("\n")}
            },
          );

        return Core${useCaseName}UseCaseResponse(
        content: responseObj.data!,
        );
    }

    @override
    CoreAuthenticationRepository get authRepo => authenticationRepository;
    } 
    `;

  // Create element with <a> tag
  const useCaseLink = document.createElement("a");

  // Create a blog object with the file content which you want to add to the file
  const useCaseFile = new Blob([useCase], { type: "dart" });

  // Add file content in the object URL
  useCaseLink.href = URL.createObjectURL(useCaseFile);

  // Add file name
  useCaseLink.download = `${camelToSnakeCase(useCaseName)}_usecase.dart`;

  // Add click event to <a> tag to save file.
  useCaseLink.click();

  URL.revokeObjectURL(useCaseLink.href);

  // and then finally
  generateUseCaseRequest(path, value, packageName);
  generateUseCaseResponse(path, value, packageName);
};

export const generateUseCaseRequest = (path: string, value: ReqestContent, packageName: string) => {
  const useCaseName = path.split("/").pop() || "";

  const formatPropType = (type: string) => {
    switch (type) {
      case "integer":
        return "int";
      case "string":
        return "String";
      case "boolean":
        return "bool";
      case "number":
        return "double";
      default:
        return type;
    }
  };

  const useCaseRequest = `
  import 'package:${packageName}/core/abstracts/useCases/usecase_request.dart';

  class Core${useCaseName}UseCaseRequest extends CoreUseCaseRequest {
      ${value.boadyParamns
        .map((x) => `final ${formatPropType(x.type)} ${x.name};`)
        .join("\n")}
      ${value.queryParamns
        .map((x) => `final ${formatPropType(x.type)} ${x.name};`)
        .join("\n")}


    Core${useCaseName}UseCaseRequest({
      ${value.boadyParamns.map((x) => `required this.${x.name},`).join("\n")}
      ${value.queryParamns.map((x) => `required this.${x.name},`).join("\n")}
    });

    @override
    List<String> get validationErrors => [];
  }
`;

  const useCaseRequestLink = document.createElement("a");

  const useCaseRequestFile = new Blob([useCaseRequest], { type: "dart" });
  useCaseRequestLink.href = URL.createObjectURL(useCaseRequestFile);

  useCaseRequestLink.download = `${camelToSnakeCase(
    useCaseName
  )}_usecase_request.dart`;

  useCaseRequestLink.click();

  URL.revokeObjectURL(useCaseRequestLink.href);
};

export const generateUseCaseResponse = (path: string, value: any, packageName: string) => {
  const useCaseName = path.split("/").pop() || "";
  const useCaseResponse = `
  class Core${useCaseName}UseCaseResponse {
    final String message;
    final dynamic content;
  
    Core${useCaseName}UseCaseResponse(
      this.content,
      this.message,
    );
  }
  `;

  const useCaseRequestLink = document.createElement("a");

  const useCaseRequestFile = new Blob([useCaseResponse], { type: "dart" });
  useCaseRequestLink.href = URL.createObjectURL(useCaseRequestFile);

  useCaseRequestLink.download = `${camelToSnakeCase(
    useCaseName
  )}_usecase_response.dart`;

  useCaseRequestLink.click();

  URL.revokeObjectURL(useCaseRequestLink.href);
};
