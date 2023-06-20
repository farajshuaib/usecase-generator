import { camelToSnakeCase } from "./functions";

export const generateUseCase = (path: string, value: any) => {
  const reqMethod = Object.keys(value)[0];
  const apiOption = Object.values(value)[0] as SwaggerPathOptions;
  const useCaseName = path.split("/").pop() || "";

  const getReqType = () => {
    return apiOption.parameters.some((x) => x.in === "query")
      ? "queryParameters"
      : "bodyParameters";
  };

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

  const useCase = `
    import 'package:core_mitf_cpanel/core/abstracts/repositories/network_repository.dart';
    import 'package:core_mitf_cpanel/core/constants/network_method.dart';
    import 'package:core_mitf_cpanel/core/abstracts/useCases/authenticated_usecase.dart';
    import 'package:core_mitf_cpanel/core/helpers/int_parser_extension.dart';
    import 'package:core_mitf_cpanel/infrastructure/authentication/authentication_repository.dart';
    import 'package:injectable/injectable.dart';

    import 'core_${camelToSnakeCase(useCaseName)}_usecase_request.dart';
    import 'core_${camelToSnakeCase(useCaseName)}_usecase_response.dart';

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
            method: CoreNetworkMethod.${reqMethod},
            authToken: await authRepo.userToken,
            responseClass: () => Core${useCaseName}ResponseModel(),
            ${getReqType()}: {
                ${apiOption.parameters
                  .map((x) => `${x.name}: request.${x.name},`)
                  .join("\n")}
            });

        return Core${useCaseName}UseCaseResponse(
        content: responseObj.data!,
        );
    }

    @override
    CoreAuthenticationRepository get authRepo => authenticationRepository;
    } 
    `;

  const useCaseRequest = `
        import 'package:core_mitf_cpanel/core/abstracts/useCases/usecase_request.dart';

        class Core${useCaseName}UseCaseRequest extends CoreUseCaseRequest {
            ${apiOption.parameters
              .map((x) => `final ${formatPropType(x.type)} ${x.name};`)
              .join("\n")}


          Core${useCaseName}UseCaseRequest({
            ${apiOption.parameters
              .map((x) => `required this.${x.name},`)
              .join("\n")}
          });

          @override
          List<String> get validationErrors => [];
        }
    `;

  // Create element with <a> tag
  const useCaseLink = document.createElement("a");
  const useCaseRequestLink = document.createElement("a");

  // Create a blog object with the file content which you want to add to the file
  const useCaseFile = new Blob([useCase], { type: "dart" });
  const useCaseRequestFile = new Blob([useCaseRequest], { type: "dart" });

  // Add file content in the object URL
  useCaseLink.href = URL.createObjectURL(useCaseFile);
  useCaseRequestLink.href = URL.createObjectURL(useCaseRequestFile);

  // Add file name
  useCaseLink.download = `Core${useCaseName}UseCase.dart`;
  useCaseRequestLink.download = `Core${useCaseName}UseCaseRequest.dart`;

  // Add click event to <a> tag to save file.
  useCaseLink.click();
  useCaseRequestLink.click();

  URL.revokeObjectURL(useCaseLink.href);
  URL.revokeObjectURL(useCaseRequestLink.href);
};
